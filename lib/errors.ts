export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  notFound: (resource: string) =>
    new AppError('NOT_FOUND', `${resource} introuvable`, 404),
  badRequest: (message: string, details?: Record<string, unknown>) =>
    new AppError('BAD_REQUEST', message, 400, details),
  forbidden: () =>
    new AppError('FORBIDDEN', 'Accès refusé', 403),
  unauthorized: () =>
    new AppError('UNAUTHORIZED', 'Non authentifié', 401),
  internal: () =>
    new AppError('INTERNAL_ERROR', 'Une erreur inattendue est survenue', 500)
};

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  };
};

export function toErrorResponse(error: unknown): Response {
  if (error instanceof AppError) {
    const body: ErrorBody = {
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? {}
      }
    };
    return Response.json(body, { status: error.statusCode });
  }

  const body: ErrorBody = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: {}
    }
  };
  return Response.json(body, { status: 500 });
}
