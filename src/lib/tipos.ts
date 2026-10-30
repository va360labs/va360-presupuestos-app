// Tipos de trabajo y los datos propios de cada uno. Lo comparten el formulario y el guardado.

export type CampoTipo = {
  clave: string;
  etiqueta: string;
  control: "texto" | "fecha" | "numero" | "opciones";
  opciones?: string[];
};

export const TIPOS = {
  BODA: {
    etiqueta: "Boda",
    articulo: "la boda",
    campos: [
      { clave: "fechaEnlace", etiqueta: "Fecha del enlace", control: "fecha" },
      { clave: "lugares", etiqueta: "Lugares", control: "texto" },
      { clave: "horasCobertura", etiqueta: "Horas de cobertura", control: "numero" },
    ],
  },
  RETRATO: {
    etiqueta: "Retrato",
    articulo: "el retrato",
    campos: [
      { clave: "numPersonas", etiqueta: "Número de personas", control: "numero" },
      { clave: "ambiente", etiqueta: "Estudio o exterior", control: "opciones", opciones: ["Estudio", "Exterior"] },
      { clave: "fotosEntregadas", etiqueta: "Fotos entregadas", control: "numero" },
    ],
  },
  PRODUCTO: {
    etiqueta: "Producto",
    articulo: "el producto",
    campos: [
      { clave: "numPiezas", etiqueta: "Número de piezas", control: "numero" },
      { clave: "tipoFondo", etiqueta: "Tipo de fondo", control: "texto" },
      { clave: "usoImagenes", etiqueta: "Uso de las imágenes", control: "texto" },
    ],
  },
} as const satisfies Record<string, { etiqueta: string; articulo: string; campos: readonly CampoTipo[] }>;

export type TipoPresupuesto = keyof typeof TIPOS;

export function esTipo(valor: unknown): valor is TipoPresupuesto {
  return typeof valor === "string" && valor in TIPOS;
}

export type DatosTipo = Record<string, string>;

// Se queda solo con los datos del tipo elegido y descarta los vacíos.
export function datosDelTipo(tipo: TipoPresupuesto, datos: DatosTipo): DatosTipo {
  const resultado: DatosTipo = {};
  for (const campo of TIPOS[tipo].campos) {
    const valor = datos[campo.clave]?.trim();
    if (valor) resultado[campo.clave] = valor;
  }
  return resultado;
}

export function leerDatosTipo(json: string | null | undefined): DatosTipo {
  if (!json) return {};
  try {
    const datos = JSON.parse(json);
    return datos && typeof datos === "object" ? (datos as DatosTipo) : {};
  } catch {
    return {};
  }
}
