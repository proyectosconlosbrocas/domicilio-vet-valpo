import { test, expect } from "@playwright/test";

test("la página carga y el hero renderiza", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Atención Veterinaria a Domicilio en Valparaíso/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Agendar por WhatsApp/i })).toBeVisible();
});

test("los enlaces de WhatsApp apuntan al número correcto; los que llevan mensaje son decodificables", async ({ page }) => {
  await page.goto("/");
  const links = await page.locator('a[href*="wa.me/56965222368"]').all();
  // 6 servicios + 2 operativos + botón flotante + hero = 10 con mensaje pre-rellenado.
  // "Agendar Consulta" (Sobre Mí) y el link de la ficha de contacto son bare a propósito,
  // igual que en el sitio original — por eso el total de enlaces es 12, no 10.
  expect(links.length).toBeGreaterThanOrEqual(12);

  let withMessage = 0;
  for (const link of links) {
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    const url = new URL(href!);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/56965222368");
    const text = url.searchParams.get("text");
    if (text) {
      expect(text.length).toBeGreaterThan(5);
      withMessage += 1;
    }
  }
  expect(withMessage).toBeGreaterThanOrEqual(10);
});

test("el formulario de contacto compone el mensaje esperado y abre WhatsApp", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contacto").scrollIntoViewIfNeeded();

  await page.fill("#name", "Juana Pérez");
  await page.fill("#phone", "+56911112222");
  await page.fill("#pet", "Rocky");
  await page.fill("#message", "Necesito una consulta a domicilio");

  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("button", { name: /Enviar por WhatsApp/i }).click(),
  ]);

  // Verificar el mensaje de éxito primero: se auto-oculta a los 5s, y las
  // aserciones de contenido de abajo no deberían arriesgar esa carrera.
  await expect(page.locator(".form-message.success")).toBeVisible();

  const url = new URL(popup.url());
  const text = decodeURIComponent(url.searchParams.get("text") ?? "");
  expect(text).toContain("Juana Pérez");
  expect(text).toContain("Rocky");
  expect(text).toContain("+56911112222");
  expect(text).toContain("Necesito una consulta a domicilio");
});

test("el menú móvil se cierra al hacer click en un link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: /abrir menú de navegación/i }).click();
  const mobileServicesLink = page.locator("ul.flex.flex-col a", { hasText: "Servicios" });
  await expect(mobileServicesLink).toBeVisible();

  await mobileServicesLink.click();
  await expect(mobileServicesLink).toBeHidden();
});
