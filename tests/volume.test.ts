import assert from "node:assert/strict";import test from "node:test";
// @ts-expect-error Node type stripping requires extension.
import {calculateVolume} from "../lib/volume.ts";
test("calculates distinct vessel geometries with memory",()=>{const flat=calculateVolume({geometry:"CYLINDER_FLAT",diameterM:2,straightLengthM:3});const heads=calculateVolume({geometry:"CYLINDER_HEMISPHERICAL",diameterM:2,straightLengthM:3});const sphere=calculateVolume({geometry:"SPHERE",diameterM:2});assert.equal(flat.resultM3,9.424778);assert.equal(heads.resultM3,13.613568);assert.equal(sphere.resultM3,4.18879);assert.match(heads.memory,/tampos hemisféricos/)});
test("rejects invalid dimensions",()=>{assert.throws(()=>calculateVolume({geometry:"CYLINDER_FLAT",diameterM:0,straightLengthM:3}));assert.throws(()=>calculateVolume({geometry:"CYLINDER_FLAT",diameterM:2,straightLengthM:0}))});
