import { expect,test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('atlas filters, construction, exports, and studio handoff work together',async({page})=>{
 await page.goto('/#geometry');
 await expect(page.locator('.atlas-card')).toHaveCount(16);
 await page.getByRole('navigation',{name:'Filter by tradition'}).getByRole('button',{name:'Andalusi',exact:true}).click();
 await expect(page.locator('.atlas-card')).toHaveCount(5);
 await page.getByRole('checkbox',{name:'Reveal construction lines'}).check();
 await expect(page.locator('.atlas-feature-svg [data-construction-role]').first()).toBeVisible();
 const before=await page.locator('.atlas-feature-svg').innerHTML();
 await page.getByRole('button',{name:'Rose & saffron',exact:true}).click();
 expect(await page.locator('.atlas-feature-svg').innerHTML()).not.toBe(before);
 await page.getByRole('button',{name:'Animate study',exact:false}).click();
 await expect(page.getByRole('button',{name:'Pause motion',exact:false})).toHaveAttribute('aria-pressed','true');
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Download SVG',exact:false}).click();
 expect((await downloadPromise).suggestedFilename()).toBe('sebka-lattice.svg');
 await page.getByRole('button',{name:'Make it yours in Studio',exact:false}).click();
 await expect(page.locator('#studio')).toBeVisible();
 await expect(page.locator('#studio .studio-canvas svg [data-atlas-module="sebka"]').first()).toBeVisible();
});

test('empty combinations recover and the atlas fits 320px RTL',async({page})=>{
 await page.goto('/#geometry');
 await page.getByRole('navigation',{name:'Filter by tradition'}).getByRole('button',{name:'Ottoman',exact:true}).click();
 await page.getByRole('group',{name:'Filter by pattern family'}).getByRole('button',{name:'Tilework',exact:true}).click();
 await expect(page.locator('.atlas-empty')).toContainText('No tiles studies');
 await page.getByRole('button',{name:'Show all Ottoman studies'}).click();
 await expect(page.locator('.atlas-card')).toHaveCount(1);
 await page.setViewportSize({width:320,height:740});
 await page.getByRole('button',{name:'RTL',exact:true}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});

test('atlas controls retain accessible contrast across all palettes',async({page})=>{
 test.setTimeout(90000);
 await page.goto('/#geometry');
 for(const name of ['Twilight','Lapis & copper','Rose & saffron','Jade & ink']){
  await page.getByRole('button',{name,exact:true}).click();
  const results=await new AxeBuilder({page}).include('#geometry').withTags(['wcag2aa','wcag2a']).analyze();
  expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))).toEqual([]);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByRole('button',{name:'Animate study',exact:false}).click();
 expect(await page.locator('.atlas-feature-svg').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
