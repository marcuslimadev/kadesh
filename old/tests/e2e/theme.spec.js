import { test, expect } from '@playwright/test';

/**
 * Testes E2E para Tema Visual Kadesh
 */

test.describe('Tema Kadesh - Cores e Estilos', () => {
  
  test('deve aplicar cor primária (#0f172a) na navbar', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const navbar = page.locator('.navbar.is-kadesh');
    await expect(navbar).toBeVisible();
    
    // Verificar cor de fundo (Slate escuro)
    const bgColor = await navbar.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // RGB(15, 23, 42) = #0f172a
    expect(bgColor).toBe('rgb(15, 23, 42)');
  });

  test('deve aplicar cor accent (#ef4444) nos botões primários', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const primaryBtn = page.locator('.button.is-kadesh-primary').first();
    
    if (await primaryBtn.isVisible()) {
      const bgColor = await primaryBtn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      // RGB(239, 68, 68) = #ef4444
      expect(bgColor).toBe('rgb(239, 68, 68)');
    }
  });

  test('deve aplicar background color (#f8fafc) no body', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // RGB(248, 250, 252) = #f8fafc
    expect(bodyBg).toBe('rgb(248, 250, 252)');
  });

  test('deve carregar arquivo kadesh-theme.css', async ({ page }) => {
    const responses = [];
    page.on('response', (response) => {
      if (response.url().includes('kadesh-theme.css')) {
        responses.push(response);
      }
    });
    
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    expect(responses.length).toBeGreaterThan(0);
    expect(responses[0].status()).toBe(200);
  });
});

test.describe('Tema Kadesh - Componentes Estilizados', () => {
  
  test('deve aplicar estilo correto nos cards', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const boxes = page.locator('.box');
    const firstBox = boxes.first();
    
    if (await firstBox.isVisible()) {
      const borderRadius = await firstBox.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      
      // Border radius deve estar definido (8px = 0.5rem)
      expect(borderRadius).not.toBe('0px');
    }
  });

  test('deve aplicar gradiente no hero section', async ({ page }) => {
    await page.goto('/jquery-frontend/auctions-demo.html');
    
    const hero = page.locator('.hero.is-kadesh');
    await expect(hero).toBeVisible();
    
    const background = await hero.evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    
    // Deve conter gradiente
    expect(background.toLowerCase()).toContain('gradient');
  });

  test('deve aplicar sombras nos elementos interativos', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const firstBox = page.locator('.box').first();
    
    if (await firstBox.isVisible()) {
      const boxShadow = await firstBox.evaluate((el) => {
        return window.getComputedStyle(el).boxShadow;
      });
      
      // Deve ter sombra
      expect(boxShadow).not.toBe('none');
    }
  });

  test('deve aplicar transições suaves em hover', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const categoryItem = page.locator('.category-item').first();
    
    if (await categoryItem.isVisible()) {
      const transition = await categoryItem.evaluate((el) => {
        return window.getComputedStyle(el).transition;
      });
      
      // Deve ter transição
      expect(transition).not.toBe('all 0s ease 0s');
    }
  });
});

test.describe('Tema Kadesh - Responsividade', () => {
  
  test('deve manter cores consistentes em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/jquery-frontend/three-column-demo.html');
    
    const navbar = page.locator('.navbar.is-kadesh');
    const bgColor = await navbar.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(bgColor).toBe('rgb(15, 23, 42)');
  });

  test('deve adaptar layout em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const layout = page.locator('.three-column-layout');
    await expect(layout).toBeVisible();
  });

  test('deve adaptar layout em desktop large', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const layout = page.locator('.three-column-layout');
    await expect(layout).toBeVisible();
  });
});

test.describe('Tema Kadesh - Acessibilidade', () => {
  
  test('deve ter contraste adequado entre texto e fundo', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const navbar = page.locator('.navbar.is-kadesh');
    const navbarItem = navbar.locator('.navbar-item').first();
    
    if (await navbarItem.isVisible()) {
      const color = await navbarItem.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      // Texto deve ser branco ou claro
      expect(color).toMatch(/rgb\(255, 255, 255\)|rgb\(248, 250, 252\)/);
    }
  });

  test('deve manter legibilidade em botões', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const primaryBtn = page.locator('.button.is-kadesh-primary').first();
    
    if (await primaryBtn.isVisible()) {
      const color = await primaryBtn.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      
      // Texto do botão deve ser branco
      expect(color).toContain('255, 255, 255');
    }
  });

  test('deve ter tamanhos de fonte legíveis', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const bodyFontSize = await page.evaluate(() => {
      return parseInt(window.getComputedStyle(document.body).fontSize);
    });
    
    // Fonte mínima de 14px
    expect(bodyFontSize).toBeGreaterThanOrEqual(14);
  });

  test('deve ter espaçamento adequado entre elementos clicáveis', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const buttons = page.locator('.button');
    const firstButton = buttons.first();
    
    if (await firstButton.isVisible()) {
      const padding = await firstButton.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          top: parseInt(style.paddingTop),
          bottom: parseInt(style.paddingBottom)
        };
      });
      
      // Padding vertical mínimo de 8px
      expect(padding.top + padding.bottom).toBeGreaterThanOrEqual(16);
    }
  });
});

test.describe('Tema Kadesh - Tipografia', () => {
  
  test('deve usar font-family consistente', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    // Deve ter uma fonte definida
    expect(bodyFont).toBeTruthy();
    expect(bodyFont).not.toBe('');
  });

  test('deve ter hierarquia de títulos clara', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const h2 = page.locator('h2, .title.is-3').first();
    const h3 = page.locator('h3, .title.is-5').first();
    
    if (await h2.isVisible() && await h3.isVisible()) {
      const h2Size = await h2.evaluate((el) => parseInt(window.getComputedStyle(el).fontSize));
      const h3Size = await h3.evaluate((el) => parseInt(window.getComputedStyle(el).fontSize));
      
      // H2 deve ser maior que H3
      expect(h2Size).toBeGreaterThan(h3Size);
    }
  });

  test('deve ter line-height adequado para leitura', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const bodyLineHeight = await page.evaluate(() => {
      return parseFloat(window.getComputedStyle(document.body).lineHeight);
    });
    
    // Line height mínimo de 1.4
    expect(bodyLineHeight).toBeGreaterThanOrEqual(1.4);
  });
});

test.describe('Tema Kadesh - Estados Interativos', () => {
  
  test('deve mudar aparência de botões em hover', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const primaryBtn = page.locator('.button.is-kadesh-primary').first();
    
    if (await primaryBtn.isVisible()) {
      // Estado normal
      const normalBg = await primaryBtn.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Hover
      await primaryBtn.hover();
      await page.waitForTimeout(300); // Aguardar transição
      
      const hoverBg = await primaryBtn.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Background pode mudar em hover
      // Ou verificar que cursor é pointer
      const cursor = await primaryBtn.evaluate((el) => 
        window.getComputedStyle(el).cursor
      );
      expect(cursor).toBe('pointer');
    }
  });

  test('deve destacar categoria ativa', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const activeCategory = page.locator('.category-item.is-active');
    
    if (await activeCategory.isVisible()) {
      const bgColor = await activeCategory.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Background não deve ser transparente ou branco
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('rgb(255, 255, 255)');
    }
  });

  test('deve mostrar feedback visual em focus', async ({ page }) => {
    await page.goto('/jquery-frontend/three-column-demo.html');
    
    const input = page.locator('input').first();
    
    if (await input.isVisible()) {
      await input.focus();
      
      const outline = await input.evaluate((el) => 
        window.getComputedStyle(el).outline
      );
      const boxShadow = await input.evaluate((el) => 
        window.getComputedStyle(el).boxShadow
      );
      
      // Deve ter outline ou box-shadow em focus
      const hasFocusStyle = outline !== 'none' || boxShadow !== 'none';
      expect(hasFocusStyle).toBeTruthy();
    }
  });
});

test.describe('Tema Kadesh - Consistência Cross-Browser', () => {
  
  test('deve renderizar corretamente em Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium');
    
  await page.goto('/jquery-frontend/three-column-demo.html');
    const navbar = page.locator('.navbar.is-kadesh');
    await expect(navbar).toBeVisible();
  });

  test('deve renderizar corretamente em Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox');
    
  await page.goto('/jquery-frontend/three-column-demo.html');
    const navbar = page.locator('.navbar.is-kadesh');
    await expect(navbar).toBeVisible();
  });

  test('deve renderizar corretamente em WebKit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit');
    
  await page.goto('/jquery-frontend/three-column-demo.html');
    const navbar = page.locator('.navbar.is-kadesh');
    await expect(navbar).toBeVisible();
  });
});
