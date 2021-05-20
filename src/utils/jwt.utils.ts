export const JWT_ERRORS = new Map([
  ['TokenExpiredError', 'Link expirado, peça um novo!'],
  ['JsonWebTokenError', 'Erro ao validar link.'],
  ['NotBeforeError', 'Erro ao validar link.'],
]);

export function handleJWTErrors(error): string {
  const msg = JWT_ERRORS.get(error.name);
  return msg || 'Algo deu errado, tente novamente mais tarde';
}
