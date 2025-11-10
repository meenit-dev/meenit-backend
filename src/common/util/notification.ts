export function replaceNotificationTemplate(
  template: string,
  replaceData: Record<string, any>,
): string {
  Object.entries(replaceData).forEach(([key, v]) => {
    template = template.replace(`{${key}}`, v);
  });
  return template;
}

export function validateTemplate(
  template: string,
  data?: Record<string, any> | null,
): boolean {
  const matches = template.match(/\{([^}]+)\}/g);
  const keysInTemplate: string[] = matches
    ? matches.map((match) => match.slice(1, -1))
    : [];

  // data 없는 경우 검증
  if (!data || Object.keys(data).length === 0) {
    return keysInTemplate.length === 0;
  }

  // template 검증
  return keysInTemplate.every((templateKey) => data[templateKey] != null);
}
