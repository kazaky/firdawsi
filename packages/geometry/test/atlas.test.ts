import { describe, it, expect } from 'vitest';
import { generatePreset, generateFromRecipe, serializeRecipe, type PatternPresetId } from '../src/index.js';
const additions:PatternPresetId[]=['sebka-lattice','lobed-arch','zellige-pinwheel','hex-rosette-field','shamsa-sunburst','islimi-vine'];
describe('expanded atlas constructions',()=>{
 it.each(additions)('%s replays the exported construction and respects the node budget',id=>{
  const result=generatePreset(id,{seed:'atlas-proof',width:600,height:460,constructionOverlay:'full',maxNodes:700});
  expect(result.diagnostics.nodeCount).toBeLessThanOrEqual(700);
  expect(result.diagnostics.truncated).toBe(false);
  expect(result.svg).not.toMatch(/NaN|Infinity|undefined/);
  expect(result.svg).toContain('data-construction-role');
  expect(generateFromRecipe(JSON.parse(serializeRecipe(result.recipe))).svg).toBe(result.svg);
  expect(result.recipe.review.geometry).toBe('research-draft');
  expect(generatePreset(id,{width:1000,height:1000,maxNodes:16}).diagnostics.nodeCount).toBeLessThanOrEqual(16);
 });
 it('reports the actual sunburst order and changes its construction',()=>{
  const twelve=generatePreset('shamsa-sunburst',{symmetry:12});
  const sixteen=generatePreset('shamsa-sunburst',{symmetry:16});
  expect(sixteen.recipe.topology.rotationOrder).toBe(16);
  expect(sixteen.svg).not.toBe(twelve.svg);
 });
 it('keeps the vine continuous at repeat boundaries',()=>{
  const result=generatePreset('islimi-vine',{unitSize:120,density:0,width:360,height:180,crop:'none'});
  // The stem advances one complete cell and returns to the same vertical midpoint.
  const size=result.recipe.repeatCell.width;
  const stems=[...result.svg.matchAll(/d="M([\d .-]+)C([\d .-]+)"/g)];
  expect(stems.length).toBeGreaterThan(3);
  for(const stem of stems){const start=stem[1].split(' ').map(Number);const coords=stem[2].split(' ').map(Number);expect(coords[4]-start[0]).toBeCloseTo(size,3);expect(coords[5]).toBeCloseTo(start[1],3);}
 });
});
