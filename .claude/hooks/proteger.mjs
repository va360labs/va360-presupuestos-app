#!/usr/bin/env node
// Hook PreToolUse para Bash y PowerShell. Lee el JSON del hook por la entrada
// estándar y bloquea (salida 2, mensaje por stderr) los comandos que:
//   1) hacen taskkill sobre todos los procesos de node por nombre de imagen,
//   2) hacen git push a master o main,
//   3) hacen git push forzado,
//   4) borran de forma recursiva (rm -rf, rmdir /s, Remove-Item -Recurse...).
import { execFileSync } from 'node:child_process';

const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash', 'cmd', 'powershell', 'pwsh']);
const ENVOLTORIOS = new Set(['sudo', 'command', 'env', 'exec', 'time', 'nohup', 'call']);
const BORRADO = new Set(['rm', 'rmdir', 'rd', 'del', 'erase', 'remove-item', 'ri']);
const RAMAS_PROTEGIDAS = new Set(['master', 'main']);

// Divide el comando en segmentos (separados por ; & | o salto de línea) y
// cada segmento en tokens, respetando comillas. La barra invertida no escapa:
// en Windows es separador de rutas.
function segmentar(texto) {
  const segmentos = [];
  let tokens = [];
  let token = '';
  let hayToken = false;
  let comilla = null;
  const cerrarToken = () => {
    if (hayToken) tokens.push(token);
    token = '';
    hayToken = false;
  };
  const cerrarSegmento = () => {
    cerrarToken();
    if (tokens.length) segmentos.push(tokens);
    tokens = [];
  };
  for (const c of texto) {
    if (comilla) {
      if (c === comilla) comilla = null;
      else token += c;
    } else if (c === '"' || c === "'") {
      comilla = c;
      hayToken = true;
    } else if (c === ';' || c === '&' || c === '|' || c === '\n') {
      cerrarSegmento();
    } else if (/\s/.test(c)) {
      cerrarToken();
    } else {
      token += c;
      hayToken = true;
    }
  }
  cerrarSegmento();
  return segmentos;
}

function nombreExe(token) {
  return token
    .replace(/^[({$]+/, '')
    .split(/[\\/]/)
    .pop()
    .toLowerCase()
    .replace(/\.(exe|cmd|bat|com)$/, '');
}

// En Git Bash las opciones de Windows se escriben //IM en vez de /IM.
const opcion = (arg) => arg.replace(/^[-/]+/, '').toLowerCase();

function ramaActual(cwd) {
  try {
    return execFileSync('git', ['branch', '--show-current'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000,
    }).trim();
  } catch {
    return '';
  }
}

function revisarTaskkill(args) {
  const i = args.findIndex((a) => opcion(a) === 'im');
  if (i === -1 || !args[i + 1]) return [];
  const imagen = args[i + 1].toLowerCase().replace(/\.exe$/, '');
  if (imagen !== 'node') return [];
  return [
    'BLOQUEADO: taskkill sobre todos los procesos de node por nombre de imagen (/IM node.exe).',
    'Mataría también los node de otros proyectos de este equipo. En su lugar, mata solo el proceso',
    'que levantó este proyecto, por número: localiza el PID del puerto del proyecto',
    '(PowerShell: Get-NetTCPConnection -LocalPort <puerto> | Select OwningProcess) y ejecuta',
    'taskkill /PID <pid> /T /F.',
  ];
}

function revisarStopProcess(args) {
  const i = args.findIndex((a) => /^-n(a(me?)?)?$/i.test(a));
  if (i === -1 || !/^node(\.exe)?$/i.test(args[i + 1] ?? '')) return [];
  return [
    'BLOQUEADO: Stop-Process -Name node cierra todos los procesos de node del equipo.',
    'En su lugar, para solo el proceso de este proyecto por número: Stop-Process -Id <pid>',
    '(el PID se obtiene del puerto: Get-NetTCPConnection -LocalPort <puerto>).',
  ];
}

function revisarPush(args, cwd) {
  const conValor = new Set(['--repo', '-o', '--push-option', '--receive-pack', '--exec']);
  const flags = [];
  const posicionales = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
      flags.push(args[i]);
      if (conValor.has(args[i])) i++;
    } else {
      posicionales.push(args[i]);
    }
  }
  const avisos = [];

  const forzado =
    flags.some((f) => f.startsWith('--force') || /^-[^-]*f/.test(f)) ||
    flags.includes('--mirror') ||
    posicionales.some((p) => p.startsWith('+'));
  if (forzado) {
    avisos.push(
      'BLOQUEADO: git push forzado (--force, --force-with-lease, -f, +refspec o --mirror).',
      'Puede sobrescribir el trabajo que ya hay en el remoto. En su lugar: git fetch y git rebase',
      '(o git pull --rebase) sobre la rama remota, y vuelve a hacer un git push normal. Si la',
      'historia remota divergió por otro motivo, explícaselo al usuario y que decida él.',
    );
  }

  // Destino de cada refspec; sin refspec o con HEAD se empuja la rama actual.
  const destinos = posicionales.slice(1).map((r) => {
    const sinMas = r.replace(/^\+/, '');
    const i = sinMas.indexOf(':');
    return (i >= 0 ? sinMas.slice(i + 1) : sinMas).replace(/^refs\/heads\//, '');
  });
  const aMaster =
    flags.includes('--all') ||
    flags.includes('--mirror') ||
    destinos.some((d) => RAMAS_PROTEGIDAS.has(d)) ||
    ((destinos.length === 0 || destinos.includes('HEAD')) &&
      RAMAS_PROTEGIDAS.has(ramaActual(cwd)));
  if (aMaster) {
    avisos.push(
      'BLOQUEADO: git push a master o main (o un push que los incluye: --all, --mirror, o la rama',
      'actual es master/main). A master/main solo se llega con una pull request aprobada por el',
      'usuario. En su lugar: trabaja en una rama feature/<n> o bugfix/<n>, súbela con',
      'git push -u origin <rama> y abre una pull request con gh pr create.',
    );
  }
  return avisos;
}

function revisarBorrado(exe, args) {
  const ps = (a) => /^-r(e(c(u(r(se?)?)?)?)?)?$/i.test(a); // -Recurse y sus abreviaturas
  const recursivo = args.some(
    (a) =>
      a === '--recursive' ||
      ps(a) ||
      (exe === 'rm' && /^-[fiIrRdvx]*[rR][fiIrRdvx]*$/.test(a)) ||
      (['rmdir', 'rd', 'del', 'erase'].includes(exe) && /^\/+s$/i.test(a)),
  );
  if (!recursivo) return [];
  return [
    `BLOQUEADO: borrado recursivo (${exe} con opción recursiva).`,
    'Un rm -rf equivocado no se puede deshacer. En su lugar: borra archivos concretos sin',
    'opción recursiva (rm <archivo>, Remove-Item <archivo>). Si hay que eliminar una carpeta',
    'entera, dile al usuario la ruta exacta y que la borre él o lo confirme explícitamente.',
  ];
}

function analizar(comando, cwd) {
  const avisos = [];
  for (const tokens of segmentar(comando)) {
    const t = [...tokens];
    while (t.length && (/^\w+=/.test(t[0]) || ENVOLTORIOS.has(nombreExe(t[0])))) t.shift();
    if (!t.length) continue;
    const exe = nombreExe(t[0]);
    const args = t.slice(1);

    if (SHELLS.has(exe)) {
      // bash -c "...", cmd /c ..., powershell -Command "...": se analiza lo que ejecutan.
      let resto = args;
      while (resto.length && /^[-/]/.test(resto[0])) resto = resto.slice(1);
      if (resto.length) avisos.push(...analizar(resto.join(' '), cwd));
    } else if (exe === 'taskkill') {
      avisos.push(...revisarTaskkill(args));
    } else if (exe === 'stop-process' || exe === 'spps') {
      avisos.push(...revisarStopProcess(args));
    } else if (exe === 'git') {
      let i = 0;
      while (i < args.length && args[i].startsWith('-')) {
        i += ['-C', '-c', '--git-dir', '--work-tree'].includes(args[i]) ? 2 : 1;
      }
      if (args[i] === 'push') avisos.push(...revisarPush(args.slice(i + 1), cwd));
    } else if (BORRADO.has(exe)) {
      avisos.push(...revisarBorrado(exe, args));
    }
  }
  // Get-Process node | Stop-Process: la tubería parte el comando en dos segmentos.
  if (/\b(get-process|gps)\b[^|;&\n]*\bnode\b[^|;&\n]*\|\s*(stop-process|spps|kill)\b/i.test(comando)) {
    avisos.push(
      'BLOQUEADO: Get-Process node | Stop-Process cierra todos los procesos de node del equipo.',
      'En su lugar, para solo el proceso de este proyecto por número: Stop-Process -Id <pid>.',
    );
  }
  return avisos;
}

let entrada = '';
process.stdin.setEncoding('utf8');
for await (const trozo of process.stdin) entrada += trozo;

let datos;
try {
  datos = JSON.parse(entrada);
} catch (error) {
  console.error(`proteger.mjs: no se pudo leer la entrada del hook (${error.message}).`);
  process.exit(1);
}

const comando = datos?.tool_input?.command;
if (typeof comando !== 'string') process.exit(0);

const avisos = analizar(comando, datos.cwd ?? process.cwd());
if (avisos.length) {
  console.error([...new Set(avisos)].join('\n'));
  process.exit(2);
}
