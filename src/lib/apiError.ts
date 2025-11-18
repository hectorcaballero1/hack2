import axios, { AxiosError } from "axios";

export const handleApiError = (error: unknown): string => {
  // Verificar si es un error de Axios
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Si el servidor respondió con un código de error
    if (axiosError.response) {
      const { status, data } = axiosError.response;

      switch (status) {
        case 400:
          return data?.message || "Solicitud inválida.";
        case 401:
          return "Credenciales incorrectas o sesión expirada.";
        case 403:
          return "No tienes permisos para realizar esta acción.";
        case 404:
          return "Recurso no encontrado.";
        case 409:
          return data?.message || "Conflicto con datos existentes.";
        case 422:
          return data?.message || "Datos no válidos.";
        case 500:
          return "Error interno del servidor. Intenta más tarde.";
        default:
          return data?.message || "Ha ocurrido un error inesperado.";
      }
    }

    // Si no hubo respuesta del servidor
    if (axiosError.request) {
      return "No hay respuesta del servidor. Revisa tu conexión.";
    }

    // Error al preparar la petición
    return axiosError.message || "Error al enviar la solicitud.";
  }

  // Error desconocido (no es axios)
  return "Error inesperado.";
};
