// preview-app.js — Customer preview page
// Loads fonts directly from Google Drive (no local font files needed)

import * as THREE from 'https://esm.sh/three@0.168.0';
import { OrbitControls } from 'https://esm.sh/three@0.168.0/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'https://esm.sh/three@0.168.0/examples/jsm/utils/BufferGeometryUtils.js';
import { SVGLoader } from 'https://esm.sh/three@0.168.0/examples/jsm/loaders/SVGLoader.js';

// ==================== Google Drive font manifest ====================
// ← Deploy cf-worker.js to Cloudflare Workers แล้ววาง URL ตรงนี้
const CF_WORKER_URL = 'https://3d-preview.imp-ranchana.workers.dev';

const IS_LOCAL = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
function driveUrl(id) {
    return IS_LOCAL ? `/drive-font?id=${id}` : `${CF_WORKER_URL}?id=${id}`;
}

const FONT_MANIFEST = [
    { label: 'MNJ Auntie Bold', id: '1mgS-2CuwarfRsQcGEk3nY28Hipp5z1L9' },
    { label: 'MNJ Lotte Bold', id: '19FrwfOR1EihdeuxWdjvzerOxB0EMbP07' },
    { label: 'GMCPopcornStrawberry', id: '1TreWRA0DHi7sCac1tS4yMXnpUYukXMIP' },
    { label: 'GMCWendyGin', id: '11oZhrtkg5v5pVY05JAcs0TQEld7EIotO' },
    { label: 'MNJ Growingday', id: '1ROzMpl1o3bwkC0NDhmoFXrt18dHqLKrp' },
    { label: 'MNJ Mochiball', id: '1wxfrXnQCTQcZ1VkOk4N8tHwkUvxGls7s' },
    { label: 'Google Sans', id: '1cwc2UtHoutT_gpPPjCDeouytWX9xJopk' },
    { label: 'CkFlowerDemo', id: '11DOMuVosZPiLkhc6iunrJAyIK4K_G4tG' },
    { label: 'GivePANI 2026', id: '150a-kT8hXpIrmXzKmc_KQ1ElY6dxAfXe' },
    { label: 'iannnnn DOG', id: '1c3foHtVREy-TxL6Fiz0zvA50utAsxU2_' },
    { label: 'iannnnn HEN Bold', id: '1iqPKiqNpCeM7W348s9zCjo0b7V1RsHGq' },
    { label: 'iannnnn TIGER', id: '10Ve-ecF0kgbWatIGxV1WgZmkEgWpKvn8' },
    { label: 'Itim', id: '144eW9ibgypc3YUnTHbl3pry-YPV5LJnM' },
    { label: 'maaja', id: '1KZ4giveQZ_8dPk0_vaVgnJ_7h8F79hnF' },
    { label: 'Mali Medium', id: '1s1sH29FkERbJDksyiEWgpR6PGRxqjWHc' },
    { label: 'MiDaifuku', id: '1BJfGR3EagfIERPr4vPq7aMwJBeSSCeqo' },
    { label: 'MiPancake', id: '1cX6qlCdOa7EJKty9Y8hvdReCim8_kxuT' },
    { label: 'Mitr', id: '1jfHle1fGSyOEScqLh_aNPaaBeTFYs34D' },
    { label: 'Noto Sans Thai', id: '17Gw7slEt4dNgAKpMRWHJ5dV9Ka5H0Xsv' },
    { label: 'Noto Thai Looped', id: '1WrUF4dxj5Mctz6airnrSFKpFI5dSi8Qs' },
    { label: 'SanamDeklen', id: '15A3Tpp97hIqabamaibQu4z6JPxOBE0Nj' },
    { label: 'Sarabun', id: '1PsSfvjeE6pJBAFfmA18yeNwJfDfZ6x5o' },
    { label: 'WDB Bangna', id: '1onvGI5LduTSFWagKLqy5V12dMc4NtODX' },
    { label: 'BarberChop', id: '18_JaEdPfpwN1Zevoo7Rm0ersX3IszEVG' },
    { label: 'Bear Days', id: '1QKvLGKGzHbWIUbuAvGtr_eW9IzVfFj31' },
    { label: 'Beaver Punch', id: '13rag_dXy0Gz3WCUFYr2rsS2MfWjHqWAi' },
    { label: 'Days of Charity', id: '13gDSb9ig2itvGNeqNQ62nFy_0TX7MyBw' },
    { label: 'Fallin For You', id: '1O9Ty03xa03gbXNfWFnOzuoovuq5q_Weu' },
    { label: 'Gokhan', id: '1LD4YAsaiArzrXYy3QnARHDBKVNN1SGAJ' },
    { label: 'Grateful Memories', id: '10rKOaxxGEXFXL6gSyNK2PEO4Uy-4SXe8' },
    { label: 'Halmera', id: '1Z9ZALgU_4V88N8QcmUSq7ZiFNT8JVK8t' },
    { label: 'Mailand Demo', id: '1FUz2VXqxlttW07Kf9sYjyk4LLR2QUVIo' },
    { label: 'Mangabey', id: '1XT_4uK7PHNjkhXzXm-x98jvRdx8fg6Hl' },
    { label: 'Marimpa', id: '1Q-tUbsyWf5y6Kl28uKn93m4WZUFiNTLA' },
    { label: 'MomoSignature', id: '1qBOqS4gRIv2ieTT8uYXZHq_vDrXGNtJG' },
    { label: 'MomoTrust', id: '1tMEiEM6yG67vftjqrawwNHdGKisOw58L' },
    { label: 'Octosale', id: '1wx0cE7z9flS9GVCEAifePOk2V29yGbtQ' },
    { label: 'Quicksand', id: '12c1021DRRwg6K7_r_B_7RUT_DTwCIEU0' },
    { label: 'Raybees', id: '1K_eHXm7KUsuOKmgPseZLgBfAKkKpoIyJ' },
    { label: 'Rochester Sign.', id: '1rAvEc8Kq4mL0SpIJrkX7iGC16OIQ0jaZ' },
    { label: 'Sacramento', id: '1ZU9utfRhb3T1mEKrTlN-xE1SzcK3WRAa' },
    { label: 'Simanja', id: '14ZD3PSGXJihX0KIYFLd-NOaZzWfml5ao' },
    { label: 'Somelove', id: '14fS_q3-z-qePwBseEiJ0A1i6NG3BYPDp' },
    { label: 'StardosStencil', id: '1Z3tTv7BarYypEKahhgRVr0LjxaDJiLZE' },
    { label: 'Super Crawler', id: '1B0qYYpht9I6ISVbYmGoz4SPh7tuXWzcq' },
    { label: 'TeX Adventor', id: '107iwAMovARc-k7FR2Kw_HI9GNL22gVDu' },
    { label: 'Ballast Stencil', id: '14dOKzIA6jlwNzzxyWWtIJAFBaSgjV0gC' },
    { label: 'Bienchen', id: '1Udaybn3nXwWj67jIl6ZbjO300kqp1uJi' },
    { label: 'Brigadier', id: '1Mt2pmdHWmuUSkgvqPVzosbGqNzORQwrV' },
    { label: 'fabfelt bold', id: '1EF9kaitd1x--qrY-kc9vG88Z1aVz4Au-' },
    { label: 'Jack Down', id: '1QPlK41qMqheKnzhQEP2ajrBHjJ0tvRIQ' },
    { label: 'LillyMae', id: '17pAf2mwa3u4m_4hNRRf1HZ8YOM2MBggU' },
    { label: 'Nickainley', id: '18f6KlBdckjqyiQeYRs8EKB2lGNoT_rM-' },
    { label: 'Pecita', id: '1xEPSifhgVraSUy5aiGa5Ryyp-KAkfELB' },
    { label: 'Roundex', id: '1iwUarIeM99Uxy_zntOLNAQ5sw-URRlh4' },
    { label: 'Secoline', id: '1oIuiz1d3M52fWCFTrOf2o8zNTBJSNePe' },
    { label: 'aptos narrow', id: '1BFX1cgzkwBcQpPYNj8VoxfI2QL6Tr-xp' },
];

const EMOJI_FONT_ID = '1yRPwQWircwI5JRVvC7xnn1fdjdB546tY';

const MSG = document.querySelector('#msg');

// ==================== Scene setup ====================
const canvas = document.querySelector('#view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(devicePixelRatio);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfaf5ff);
const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 2000);
camera.position.set(0, 0, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.update();

scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1));
const dir = new THREE.DirectionalLight(0xffffff, 0.75);
dir.position.set(60, -60, 160);
scene.add(dir);
const grid = new THREE.GridHelper(400, 40, 0xdddddd, 0xeeeeee);
grid.rotation.x = Math.PI / 2;
scene.add(grid);

// ==================== Model storage ====================
let models = [];

// ==================== Fixed config for preview ====================
function cfg() {
    return {
        style: 'raised',
        baseEnabled: true,
        letterHeight: 1.0,
        baseHeight: 2.0,
        outline: 4.0,
        mmPerUnit: 0.25,
        earEnabled: true,
        earSide: 'left',
        earPlacement: 'side',
        holeDiameter: 4.0,
        earRingThickness: 3.0,
        earAttachOverlap: 2.0,
        earYShift: 0.0,
        totalWidth: NaN,
        totalHeight: 13,
        letterSpacing: 0.0,
        lineSpacing: 1.2,
        textAlign: 'center',
        baseColor: '#ffffff',
        textColor: '#222222',
        textStroke: 0.0,
        cornerRadius: 3.0,
    };
}

// ==================== Font utils ====================
function isLikelyFontBuffer(buf) {
    const u8 = new Uint8Array(buf.slice(0, 4));
    const isTTF = (u8[0] === 0x00 && u8[1] === 0x01 && u8[2] === 0x00 && u8[3] === 0x00);
    const isOTF = (u8[0] === 0x4F && u8[1] === 0x54 && u8[2] === 0x54 && u8[3] === 0x4F);
    return isTTF || isOTF;
}

let fontBuffer = null;
let currentFont = null;
let emojiFontBuffer = null;
let emojiFont = null;

async function fetchFontFromDrive(driveId) {
    const url = driveUrl(driveId);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const buf = await resp.arrayBuffer();
    if (!isLikelyFontBuffer(buf)) throw new Error('Not a valid font file');
    return buf;
}

async function loadEmojiFont() {
    if (emojiFont) return emojiFont;
    try {
        emojiFontBuffer = await fetchFontFromDrive(EMOJI_FONT_ID);
        emojiFont = opentype.parse(emojiFontBuffer);
        return emojiFont;
    } catch (e) {
        console.warn('Could not load emoji font:', e);
        return null;
    }
}

function isGlyphMissing(g) {
    return !g || g.name === '.notdef';
}

async function loadDefaultFont() {
    if (fontBuffer) return;
    const first = FONT_MANIFEST[0];
    if (!first) throw new Error('No fonts in manifest');
    fontBuffer = await fetchFontFromDrive(first.id);
    MSG.textContent = '';
}

async function loadFontById(driveId) {
    try {
        MSG.textContent = 'Loading font...';
        fontBuffer = await fetchFontFromDrive(driveId);
        MSG.textContent = '';
        return true;
    } catch (e) {
        MSG.textContent = `Failed to load font: ${e.message}`;
        return false;
    }
}

// ==================== SVG/Shape helpers ====================
function svgFromOpenType(pathData) {
    return `<svg xmlns="http://www.w3.org/2000/svg"><path d="${pathData}" fill="#000"/></svg>`;
}
function toShapesFromSVG(svgString) {
    const loader = new SVGLoader();
    const data = loader.parse(svgString);
    const shapes = [];
    for (const p of data.paths) shapes.push(...SVGLoader.createShapes(p));
    return shapes;
}
function samplePathCommands(commands, step = 12) {
    const contours = [];
    let current = [];
    let penX = 0, penY = 0, startX = 0, startY = 0;
    const add = (x, y) => current.push({ X: x, Y: y });
    for (const c of commands) {
        if (c.type === 'M') { if (current.length) { contours.push(current); current = []; } penX = startX = c.x; penY = startY = c.y; add(penX, penY); }
        else if (c.type === 'L') { penX = c.x; penY = c.y; add(penX, penY); }
        else if (c.type === 'Q') {
            const x0 = penX, y0 = penY;
            for (let i = 1; i <= step; i++) {
                const t = i / step, mt = 1 - t;
                add(mt * mt * x0 + 2 * mt * t * c.x1 + t * t * c.x, mt * mt * y0 + 2 * mt * t * c.y1 + t * t * c.y);
            }
            penX = c.x; penY = c.y;
        }
        else if (c.type === 'C') {
            const x0 = penX, y0 = penY;
            for (let i = 1; i <= step; i++) {
                const t = i / step, mt = 1 - t;
                add(mt ** 3 * x0 + 3 * mt * mt * t * c.x1 + 3 * mt * t * t * c.x2 + t ** 3 * c.x,
                    mt ** 3 * y0 + 3 * mt * mt * t * c.y1 + 3 * mt * t * t * c.y2 + t ** 3 * c.y);
            }
            penX = c.x; penY = c.y;
        }
        else if (c.type === 'Z') { if (current.length) { contours.push(current); current = []; } penX = startX; penY = startY; }
    }
    if (current.length) contours.push(current);
    return contours;
}
function ringToPath(ring) {
    const path = new THREE.Path();
    ring.forEach((p, i) => i ? path.lineTo(p.X, p.Y) : path.moveTo(p.X, p.Y));
    path.closePath();
    return path;
}
function polygonToShape(poly) {
    const s = new THREE.Shape();
    poly.forEach((p, i) => i ? s.lineTo(p.X, p.Y) : s.moveTo(p.X, p.Y));
    s.closePath();
    return s;
}
function shapesFromOffsetContours(contoursFU, strokeMM, mmPerUnit) {
    const CLIP = 100;
    const delta = (strokeMM / mmPerUnit) * CLIP;
    const off = new ClipperLib.ClipperOffset(2, 0.25);
    for (const con of contoursFU) {
        const path = con.map(pt => ({ X: pt.X * CLIP, Y: pt.Y * CLIP }));
        off.AddPath(path, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
    }
    const offsetPaths = new ClipperLib.Paths();
    off.Execute(offsetPaths, delta);
    if (!offsetPaths.length) return [];
    const clipper = new ClipperLib.Clipper();
    clipper.AddPaths(offsetPaths, ClipperLib.PolyType.ptSubject, true);
    const polyTree = new ClipperLib.PolyTree();
    clipper.Execute(ClipperLib.ClipType.ctUnion, polyTree, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
    const shapes = [];
    function walk(node) {
        for (const ch of node.Childs()) {
            if (!ch.IsHole()) {
                const outer = ch.Contour().map(pt => ({ X: pt.X / CLIP, Y: pt.Y / CLIP }));
                const shape = polygonToShape(outer);
                for (const h of ch.Childs()) {
                    if (h.IsHole()) {
                        const hole = h.Contour().map(pt => ({ X: pt.X / CLIP, Y: pt.Y / CLIP }));
                        shape.holes.push(ringToPath(hole));
                    }
                }
                shapes.push(shape);
            }
            walk(ch);
        }
    }
    walk(polyTree);
    return shapes;
}

// ==================== Thai text helpers ====================
function isThaiAboveVowel(code) {
    return code === 0x0E31 || (code >= 0x0E34 && code <= 0x0E37) || code === 0x0E47;
}
function isThaiToneMark(code) {
    return (code >= 0x0E48 && code <= 0x0E4C) || code === 0x0E4D;
}

// ==================== Text path builder ====================
function buildTextPathWithSpacing(font, text, fontSize, letterSpacingMM, mmPerUnit, lineSpacingMultiplier = 1.2, textAlign = 'center', lineFontSizes = null, efont = null) {
    const path = new opentype.Path();
    if (!text || !font) return path;
    const lines = text.split('\n');
    const spacingFU = letterSpacingMM / mmPerUnit;
    const lineWidths = [];
    const lineHeights = [];
    let maxWidth = 0;

    function resolveGlyph(char) {
        const g = font.charToGlyph(char);
        if (!isGlyphMissing(g)) return { g, glyphFont: font };
        if (efont) {
            const eg = efont.charToGlyph(char);
            if (!isGlyphMissing(eg)) return { g: eg, glyphFont: efont };
        }
        return { g, glyphFont: font };
    }

    function resolveLineGlyphs(lineText) {
        const result = [];
        let mainGlyphs;
        try {
            mainGlyphs = font.stringToGlyphs(lineText);
        } catch (e) {
            try {
                mainGlyphs = font.stringToGlyphs(lineText, { features: {} });
            } catch (e2) {
                mainGlyphs = null;
            }
        }
        if (mainGlyphs && efont) {
            const chars = [...lineText];
            for (let i = 0; i < mainGlyphs.length; i++) {
                const g = mainGlyphs[i];
                if (isGlyphMissing(g) && i < chars.length) {
                    const eg = efont.charToGlyph(chars[i]);
                    if (!isGlyphMissing(eg)) { result.push({ g: eg, glyphFont: efont }); continue; }
                }
                result.push({ g, glyphFont: font });
            }
        } else if (mainGlyphs) {
            mainGlyphs.forEach(g => result.push({ g, glyphFont: font }));
        } else {
            const chars = [...lineText];
            chars.forEach(char => result.push(resolveGlyph(char)));
        }
        return result;
    }

    lines.forEach((lineText, lineIndex) => {
        if (!lineText.trim()) { lineWidths.push(0); lineHeights.push(fontSize * lineSpacingMultiplier); return; }
        const lineFontSize = lineFontSizes && lineFontSizes[lineIndex] ? lineFontSizes[lineIndex] : fontSize;
        const lineScale = lineFontSize / font.unitsPerEm;
        const lineSpacingPathLocal = spacingFU * lineScale;
        let lineWidth = 0;
        const resolved = resolveLineGlyphs(lineText);
        resolved.forEach(({ g, glyphFont }) => {
            const aw = g.advanceWidth || 0;
            const gScale = lineFontSize / glyphFont.unitsPerEm;
            lineWidth += aw * gScale;
            if (aw > 0) lineWidth += lineSpacingPathLocal;
        });
        lineWidths.push(lineWidth);
        lineHeights.push(lineFontSize * lineSpacingMultiplier);
        if (lineWidth > maxWidth) maxWidth = lineWidth;
    });

    let currentY = 0;
    lines.forEach((lineText, lineIndex) => {
        if (!lineText.trim()) { currentY += lineHeights[lineIndex]; return; }
        const lineFontSize = lineFontSizes && lineFontSizes[lineIndex] ? lineFontSizes[lineIndex] : fontSize;
        const lineScale = lineFontSize / font.unitsPerEm;
        const lineSpacingPathLocal = spacingFU * lineScale;
        let startX = 0;
        if (textAlign === 'center') startX = -lineWidths[lineIndex] / 2;
        else if (textAlign === 'right') startX = -lineWidths[lineIndex];
        const resolved = resolveLineGlyphs(lineText);
        const chars = [...lineText];
        const canAdjustThai = (chars.length === resolved.length);
        let x = startX;
        for (let ri = 0; ri < resolved.length; ri++) {
            const { g, glyphFont } = resolved[ri];
            const gScale = lineFontSize / glyphFont.unitsPerEm;
            let glyphY = currentY;
            if (canAdjustThai && ri > 0) {
                const currCode = chars[ri].codePointAt(0);
                const prevCode = chars[ri - 1].codePointAt(0);
                if (isThaiToneMark(currCode) && isThaiAboveVowel(prevCode)) {
                    try {
                        const prevBB = resolved[ri - 1].g.getBoundingBox();
                        const currBB = g.getBoundingBox();
                        const overlap = prevBB.y2 - currBB.y1;
                        if (overlap > 0 && overlap < font.unitsPerEm) {
                            const gap = font.unitsPerEm * 0.05;
                            glyphY -= (overlap + gap) * lineScale;
                        }
                    } catch (e) {
                        glyphY -= font.unitsPerEm * 0.25 * lineScale;
                    }
                }
            }
            try { const gp = g.getPath(x, glyphY, lineFontSize); gp.commands.forEach(cmd => path.commands.push(cmd)); } catch (e) {}
            const aw = g.advanceWidth || 0;
            let advance = aw * gScale;
            if (aw > 0) advance += lineSpacingPathLocal;
            x += advance;
        }
        currentY += lineHeights[lineIndex];
    });
    return path;
}

// ==================== Build geometries for a single name ====================
async function buildGeometriesForName(nameText, lowDetail = true) {
    if (!fontBuffer) await loadDefaultFont();
    let font;
    try {
        font = opentype.parse(fontBuffer);
        currentFont = font;
    } catch (e) {
        await loadDefaultFont();
        font = opentype.parse(fontBuffer);
        currentFont = font;
    }

    const efont = await loadEmojiFont();
    const curveSegsText = lowDetail ? 4 : 8;
    const curveSegsBase = lowDetail ? 16 : 24;
    const sampleStep = lowDetail ? 6 : 8;

    let fontSize = 100;
    const c = cfg();

    if (Number.isFinite(c.totalHeight) && c.totalHeight > 0 && currentFont) {
        fontSize = c.totalHeight / c.mmPerUnit;
    }

    const otPath = buildTextPathWithSpacing(font, nameText, fontSize, c.letterSpacing, c.mmPerUnit, c.lineSpacing, c.textAlign, null, efont);
    const svg = svgFromOpenType(otPath.toPathData(3));

    let letterShapesFU;
    if (Math.abs(c.textStroke) < 1e-6) {
        letterShapesFU = toShapesFromSVG(svg);
    } else {
        const contoursFU = samplePathCommands(otPath.commands, sampleStep);
        letterShapesFU = shapesFromOffsetContours(contoursFU, c.textStroke, c.mmPerUnit);
    }

    const textGeom = new THREE.ExtrudeGeometry(letterShapesFU, {
        depth: c.letterHeight, bevelEnabled: false, curveSegments: curveSegsText, steps: 1
    });
    textGeom.scale(c.mmPerUnit, -c.mmPerUnit, 1);
    textGeom.translate(0, 0, c.baseHeight); // sit on top of base
    textGeom.computeVertexNormals();

    const contours = samplePathCommands(otPath.commands, sampleStep);
    const CLIP = 100;
    const offsetter = new ClipperLib.ClipperOffset(2, 0.25);
    for (const con of contours) {
        offsetter.AddPath(con.map(pt => ({ X: pt.X * CLIP, Y: pt.Y * CLIP })), ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
    }
    const outPaths = [];
    offsetter.Execute(outPaths, (c.outline / c.mmPerUnit) * CLIP);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const baseShapes = outPaths.map(p => {
        const ptsFU = p.map(pt => ({ X: pt.X / CLIP, Y: pt.Y / CLIP }));
        for (const q of ptsFU) { if (q.X < minX) minX = q.X; if (q.X > maxX) maxX = q.X; if (q.Y < minY) minY = q.Y; if (q.Y > maxY) maxY = q.Y; }
        return polygonToShape(ptsFU);
    });

    let earGeom = null;
    if (c.earEnabled) {
        const rHoleMM = c.holeDiameter * 0.5;
        const rOuterMM = rHoleMM + c.earRingThickness;
        const attachMM = c.earAttachOverlap;
        let cxMM, yCenterMM;
        if (c.earSide === 'top') {
            cxMM = ((minX + maxX) / 2) * c.mmPerUnit + c.earYShift;
            yCenterMM = (minY * c.mmPerUnit) - rOuterMM + attachMM;
        } else {
            yCenterMM = ((minY + maxY) / 2) * c.mmPerUnit - c.earYShift;
            cxMM = (c.earSide === 'right') ? ((maxX * c.mmPerUnit) + rOuterMM - attachMM) : ((minX * c.mmPerUnit) - rOuterMM + attachMM);
        }
        const scale = 1 / c.mmPerUnit;
        const earShape = new THREE.Shape();
        earShape.absarc(cxMM * scale, yCenterMM * scale, rOuterMM * scale, 0, Math.PI * 2, false);
        const earHole = new THREE.Path();
        earHole.absarc(cxMM * scale, yCenterMM * scale, rHoleMM * scale, 0, Math.PI * 2, false);
        earShape.holes.push(earHole);
        earGeom = new THREE.ExtrudeGeometry([earShape], { depth: c.baseHeight, bevelEnabled: false, curveSegments: curveSegsBase, steps: 1 });
        earGeom.scale(c.mmPerUnit, -c.mmPerUnit, 1);
        earGeom.computeVertexNormals();
    }

    const baseGeom = new THREE.ExtrudeGeometry(baseShapes, { depth: c.baseHeight, bevelEnabled: false, curveSegments: curveSegsBase, steps: 1 });
    baseGeom.scale(c.mmPerUnit, -c.mmPerUnit, 1);
    baseGeom.computeVertexNormals();
    return { textGeom, baseGeom, earGeom };
}

// ==================== Center helpers ====================
function centerPair(baseGeom, textGeom, earGeom = null) {
    const geoms = [];
    if (baseGeom?.attributes?.position) geoms.push(baseGeom.clone());
    if (textGeom?.attributes?.position?.count > 0) geoms.push(textGeom.clone());
    if (!geoms.length) return;
    const mergedForCenter = BufferGeometryUtils.mergeGeometries(geoms, false);
    const attr = mergedForCenter.getAttribute('position');
    if (!attr) return;
    const box = new THREE.Box3().setFromBufferAttribute(attr);
    const center = box.getCenter(new THREE.Vector3());
    baseGeom?.translate?.(-center.x, -center.y, -center.z);
    if (textGeom?.attributes?.position?.count > 0) textGeom.translate(-center.x, -center.y, -center.z);
    if (earGeom?.attributes?.position?.count > 0) earGeom.translate(-center.x, -center.y, -center.z);
}

// ==================== Clear scene ====================
function clearModels() {
    for (const m of models) {
        if (m.group) {
            scene.remove(m.group);
            m.group.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
        }
    }
    models = [];
}

// ==================== REFRESH: build all models ====================
async function refreshAll() {
    const rawText = (document.querySelector('#text').value || '').trim();
    if (!rawText) {
        MSG.textContent = 'Please enter a name';
        return;
    }
    const names = [rawText];

    clearModels();
    const c = cfg();
    const hasVerts = (g) => g && g.attributes && g.attributes.position && g.attributes.position.count > 0;

    MSG.textContent = `Generating ${names.length} model(s)...`;

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        try {
            const { textGeom, baseGeom, earGeom } = await buildGeometriesForName(name, true);
            centerPair(baseGeom, textGeom, earGeom);

            const group = new THREE.Group();
            group.name = name;

            if (c.baseEnabled && hasVerts(baseGeom)) {
                const baseMesh = new THREE.Mesh(baseGeom, new THREE.MeshStandardMaterial({
                    color: new THREE.Color(c.baseColor), metalness: 0.1, roughness: 0.5,
                    emissive: new THREE.Color(c.baseColor), emissiveIntensity: 0.15
                }));
                group.add(baseMesh);
            }

            if (hasVerts(textGeom)) {
                const textMesh = new THREE.Mesh(textGeom, new THREE.MeshStandardMaterial({
                    color: new THREE.Color(c.textColor), metalness: 0.1, roughness: 0.5,
                    emissive: new THREE.Color(c.textColor), emissiveIntensity: 0.15
                }));
                group.add(textMesh);
            }

            if (c.baseEnabled && hasVerts(earGeom)) {
                const earMesh = new THREE.Mesh(earGeom, new THREE.MeshStandardMaterial({
                    color: new THREE.Color(c.baseColor), metalness: 0.1, roughness: 0.5,
                    emissive: new THREE.Color(c.baseColor), emissiveIntensity: 0.15
                }));
                group.add(earMesh);
            }

            scene.add(group);
            models.push({ name, group });
        } catch (e) {
            console.error(`Error building model for "${name}":`, e);
        }
    }

    if (models.length > 0) {
        const N = models.length;
        const cols = Math.ceil(Math.sqrt(N));
        const GAP = 5;
        const sizes = models.map(m => {
            const b = new THREE.Box3().setFromObject(m.group);
            return b.getSize(new THREE.Vector3());
        });
        const maxW = Math.max(...sizes.map(s => s.x));
        const maxH = Math.max(...sizes.map(s => s.y));
        const cellW = maxW + GAP;
        const cellH = maxH + GAP;
        const rows = Math.ceil(N / cols);
        models.forEach((m, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            m.group.position.x = (col - (cols - 1) / 2) * cellW;
            m.group.position.y = -(row - (rows - 1) / 2) * cellH;
        });
    }

    if (models.length === 0) {
        MSG.textContent = 'Failed to create models';
            return;
    }

    const allBox = new THREE.Box3();
    for (const m of models) allBox.expandByObject(m.group);
    const allSize = allBox.getSize(new THREE.Vector3());
    const allCenter = allBox.getCenter(new THREE.Vector3());

    controls.target.copy(allCenter);
    const dist = allSize.length();
    camera.near = Math.max(0.1, dist / 100);
    camera.far = Math.max(500, dist * 10);
    camera.updateProjectionMatrix();
    camera.position.set(allCenter.x, allCenter.y, allCenter.z + dist);
    controls.update();

    MSG.textContent = '';
    setCameraView('top');
}

// ==================== Render loop ====================
function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
}
renderer.setAnimationLoop(() => { resize(); controls.update(); renderer.render(scene, camera); });

// ==================== Camera views ====================
function setCameraView(view) {
    const allBox = new THREE.Box3();
    for (const m of models) allBox.expandByObject(m.group);
    if (!isFinite(allBox.min.x)) return;
    const centroid = allBox.getCenter(new THREE.Vector3());
    const sizeVec = allBox.getSize(new THREE.Vector3());
    const distance = sizeVec.length();
    let pos = { x: centroid.x, y: centroid.y, z: centroid.z };
    switch (view) {
        case 'top': pos.z += distance; break;
        case 'front': pos.y -= distance; break;
        case 'side': pos.x += distance; break;
        default: pos.z += distance;
    }
    camera.position.set(pos.x, pos.y, pos.z);
    controls.target.copy(centroid);
    controls.update();
}

// ==================== Watermark overlay ====================
function buildWatermark() {
    const el = document.getElementById('watermarkOverlay');
    if (!el) return;
    const text = 'Ally.Studio';
    const cols = 12;
    const rows = 20;
    const gap = 120;
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">`;
    svgContent += `<defs><style>text{font-family:'Nunito',sans-serif;font-weight:700;font-size:13px;fill:rgba(140,100,180,0.10);}</style></defs>`;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * gap + (r % 2 ? gap / 2 : 0);
            const y = r * 38 + 20;
            svgContent += `<text x="${x}" y="${y}" transform="rotate(-25,${x},${y})">${text}</text>`;
        }
    }
    svgContent += `</svg>`;
    el.innerHTML = svgContent;
}
buildWatermark();

// ==================== Font grid ====================
function populateFontGrid() {
    const grid = document.getElementById('fontGrid');
    if (!grid) return;

    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    FONT_MANIFEST.forEach((entry, idx) => {
        const fontNumber = String(idx + 1).padStart(2, '0');
        const safeName = entry.label.replace(/[^a-zA-Z0-9]/g, '_');
        const fontFamilyName = `FP_${safeName}`;
        const fontUrl = driveUrl(entry.id);
        styleEl.textContent += `@font-face { font-family: '${fontFamilyName}'; src: url('${fontUrl}'); font-display: swap; }\n`;

        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'font-chip';
        chip.textContent = `F${fontNumber}`;
        chip.style.fontFamily = `'${fontFamilyName}', sans-serif`;
        chip.title = entry.label;
        chip.addEventListener('click', async () => {
            grid.querySelectorAll('.font-chip').forEach(el => el.classList.remove('active'));
            chip.classList.add('active');
            await loadFontById(entry.id);
            await refreshAll();
        });
        grid.appendChild(chip);

        if (idx === 0) chip.classList.add('active');
    });
}

// ==================== Event listeners ====================
document.querySelectorAll('.view-btn[data-view]').forEach(btn => {
    btn.addEventListener('click', () => setCameraView(btn.dataset.view));
});

// ==================== Init ====================
populateFontGrid();
loadDefaultFont().catch(e => console.warn('Default font load failed:', e));
loadEmojiFont().catch(e => console.warn('Emoji font load failed:', e));
