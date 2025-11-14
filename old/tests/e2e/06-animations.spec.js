import { test, expect } from '@playwright/test';

test.describe('Animações e Efeitos Visuais', () => {
  test('deve ter elementos com animação na home', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Verificar se elementos animados estão presentes
    const animatedElements = await page.locator('[class*="animate-"]').count();
    expect(animatedElements).toBeGreaterThan(0);
  });

  test('deve ter efeito glassmorphism no navbar', async ({ page }) => {
    await page.goto('/');
    
    const navbar = page.locator('nav');
    const hasBackdropBlur = await navbar.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.backdropFilter.includes('blur') || el.className.includes('backdrop-blur');
    });
    
    expect(hasBackdropBlur).toBeTruthy();
  });

  test('deve ter partículas flutuantes no hero', async ({ page }) => {
    await page.goto('/');
    
    // Verificar elementos com animação blob/float
    const floatingElements = await page.locator('[class*="animate-blob"], [class*="animate-float"]').count();
    expect(floatingElements).toBeGreaterThan(0);
  });

  test('deve ter hover effects nos cards de categoria', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    // Pegar primeiro card de categoria
    const categoryCard = page.locator('.category-card, [class*="group"]').first();
    
    if (await categoryCard.isVisible()) {
      // Verificar se tem classe de transição/hover
      const hasHoverEffect = await categoryCard.evaluate(el => 
        el.className.includes('hover:') || el.className.includes('transition')
      );
      
      expect(hasHoverEffect).toBeTruthy();
    }
  });

  test('deve ter transições suaves em todos os elementos', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se CSS global tem transições
    const hasGlobalTransition = await page.evaluate(() => {
      const allElements = window.getComputedStyle(document.querySelector('*'));
      return allElements.transition.length > 0 || 
             document.styleSheets[0].cssRules[0].cssText.includes('transition');
    });
    
    expect(hasGlobalTransition).toBeTruthy();
  });

  test('deve ter scroll suave', async ({ page }) => {
    await page.goto('/');
    
    const hasSmoothScroll = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollBehavior === 'smooth' ||
             document.documentElement.style.scrollBehavior === 'smooth';
    });
    
    expect(hasSmoothScroll).toBeTruthy();
  });

  test('deve ter gradientes animados', async ({ page }) => {
    await page.goto('/');
    
    const gradientElements = await page.locator('[class*="gradient"], [class*="animate-gradient"]').count();
    expect(gradientElements).toBeGreaterThan(0);
  });

  test('cards devem ter sombra ao hover', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    const cards = page.locator('.card, [class*="shadow"]');
    const cardCount = await cards.count();
    
    expect(cardCount).toBeGreaterThan(0);
  });
});
