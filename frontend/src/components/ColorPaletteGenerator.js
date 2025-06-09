import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  SwatchIcon,
  EyeDropperIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  BeakerIcon,
  CpuChipIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const ColorPaletteGenerator = ({ onColorSelect, selectedColors = [], maxColors = 4 }) => {
  const [generatedPalettes, setGeneratedPalettes] = useState([]);
  const [customColor, setCustomColor] = useState('#3B82F6');
  const [harmonyType, setHarmonyType] = useState('complementary');
  const [substrateType, setSubstrateType] = useState('white');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const harmonyTypes = {
    complementary: { name: 'Complementary', description: 'Colors opposite on color wheel' },
    triadic: { name: 'Triadic', description: 'Three evenly spaced colors' },
    analogous: { name: 'Analogous', description: 'Adjacent colors on wheel' },
    monochromatic: { name: 'Monochromatic', description: 'Shades of single color' },
    splitComplementary: { name: 'Split Complementary', description: 'Base + two adjacent to complement' }
  };

  const substrateTypes = {
    white: { name: 'White', description: 'Standard white substrate', impact: 'neutral' },
    clear: { name: 'Clear/Transparent', description: 'Clear film/plastic', impact: 'high' },
    kraft: { name: 'Kraft Paper', description: 'Brown kraft paper', impact: 'warm' },
    metallic: { name: 'Metallic', description: 'Foil or metallic surface', impact: 'reflective' },
    colored: { name: 'Colored Paper', description: 'Pre-colored substrate', impact: 'variable' }
  };

  const flexoStandardColors = [
    { name: 'Process Cyan', hex: '#00AEEF', cmyk: [100, 0, 0, 0], pantone: '3125 C' },
    { name: 'Process Magenta', hex: '#EC008C', cmyk: [0, 100, 0, 0], pantone: '213 C' },
    { name: 'Process Yellow', hex: '#FFF200', cmyk: [0, 0, 100, 0], pantone: '102 C' },
    { name: 'Process Black', hex: '#000000', cmyk: [0, 0, 0, 100], pantone: 'Process Black' },
    { name: 'Pantone Red 032', hex: '#EF3340', cmyk: [0, 89, 85, 0], pantone: '032 C' },
    { name: 'Pantone Blue 286', hex: '#0033A0', cmyk: [100, 75, 0, 15], pantone: '286 C' },
    { name: 'Pantone Green 354', hex: '#00B04F', cmyk: [75, 0, 100, 0], pantone: '354 C' },
    { name: 'Pantone Orange 021', hex: '#FF6900', cmyk: [0, 70, 100, 0], pantone: '021 C' }
  ];

  useEffect(() => {
    generateDefaultPalettes();
  }, [harmonyType, substrateType]);

  const generateDefaultPalettes = () => {
    const palettes = [];
    
    // Generate flexo-optimized palettes
    const basePalette = generateHarmonyPalette('#3B82F6', harmonyType);
    palettes.push({
      id: 'harmony-blue',
      name: `${harmonyTypes[harmonyType].name} Blue`,
      colors: basePalette,
      type: 'harmony',
      flexoOptimized: true
    });

    const basePalette2 = generateHarmonyPalette('#EF4444', harmonyType);
    palettes.push({
      id: 'harmony-red',
      name: `${harmonyTypes[harmonyType].name} Red`,
      colors: basePalette2,
      type: 'harmony',
      flexoOptimized: true
    });

    // Standard flexo palette
    palettes.push({
      id: 'flexo-standard',
      name: 'Flexo Standard CMYK',
      colors: flexoStandardColors.slice(0, 4),
      type: 'standard',
      flexoOptimized: true
    });

    // High contrast palette for clear substrates
    if (substrateType === 'clear') {
      palettes.push({
        id: 'high-contrast',
        name: 'High Contrast (Clear)',
        colors: [
          { name: 'Deep Black', hex: '#000000', cmyk: [0, 0, 0, 100], pantone: 'Process Black' },
          { name: 'Pure White', hex: '#FFFFFF', cmyk: [0, 0, 0, 0], pantone: 'White' },
          { name: 'Bright Red', hex: '#FF0000', cmyk: [0, 100, 100, 0], pantone: '032 C' },
          { name: 'Electric Blue', hex: '#0080FF', cmyk: [75, 25, 0, 0], pantone: '285 C' }
        ],
        type: 'substrate-optimized',
        flexoOptimized: true
      });
    }

    setGeneratedPalettes(palettes);
  };

  const generateHarmonyPalette = (baseColor, type) => {
    const baseHsl = hexToHsl(baseColor);
    const colors = [];

    switch (type) {
      case 'complementary':
        colors.push(createColorInfo('Base', baseColor));
        colors.push(createColorInfo('Complement', hslToHex((baseHsl[0] + 180) % 360, baseHsl[1], baseHsl[2])));
        colors.push(createColorInfo('Base Light', hslToHex(baseHsl[0], baseHsl[1] * 0.7, Math.min(baseHsl[2] * 1.3, 100))));
        colors.push(createColorInfo('Complement Dark', hslToHex((baseHsl[0] + 180) % 360, baseHsl[1], baseHsl[2] * 0.7)));
        break;
      
      case 'triadic':
        colors.push(createColorInfo('Base', baseColor));
        colors.push(createColorInfo('Triadic 1', hslToHex((baseHsl[0] + 120) % 360, baseHsl[1], baseHsl[2])));
        colors.push(createColorInfo('Triadic 2', hslToHex((baseHsl[0] + 240) % 360, baseHsl[1], baseHsl[2])));
        colors.push(createColorInfo('Neutral', hslToHex(baseHsl[0], 0.1, 0.8)));
        break;
      
      case 'analogous':
        colors.push(createColorInfo('Base', baseColor));
        colors.push(createColorInfo('Analogous 1', hslToHex((baseHsl[0] + 30) % 360, baseHsl[1], baseHsl[2])));
        colors.push(createColorInfo('Analogous 2', hslToHex((baseHsl[0] - 30 + 360) % 360, baseHsl[1], baseHsl[2])));
        colors.push(createColorInfo('Accent', hslToHex((baseHsl[0] + 60) % 360, baseHsl[1] * 0.8, baseHsl[2] * 0.9)));
        break;
      
      case 'monochromatic':
        colors.push(createColorInfo('Dark', hslToHex(baseHsl[0], baseHsl[1], baseHsl[2] * 0.3)));
        colors.push(createColorInfo('Base', baseColor));
        colors.push(createColorInfo('Light', hslToHex(baseHsl[0], baseHsl[1] * 0.7, Math.min(baseHsl[2] * 1.4, 100))));
        colors.push(createColorInfo('Pale', hslToHex(baseHsl[0], baseHsl[1] * 0.3, Math.min(baseHsl[2] * 1.8, 95))));
        break;
      
      default:
        colors.push(createColorInfo('Base', baseColor));
        break;
    }

    return colors.slice(0, maxColors);
  };

  const createColorInfo = (name, hex) => {
    const cmyk = hexToCmyk(hex);
    return {
      name,
      hex,
      cmyk,
      pantone: findClosestPantone(hex)
    };
  };

  const generateCustomPalette = async () => {
    setLoading(true);
    try {
      const palette = generateHarmonyPalette(customColor, harmonyType);
      const newPalette = {
        id: `custom-${Date.now()}`,
        name: `Custom ${harmonyTypes[harmonyType].name}`,
        colors: palette,
        type: 'custom',
        flexoOptimized: true
      };
      
      setGeneratedPalettes(prev => [newPalette, ...prev]);
      toast.success('Custom palette generated!');
    } catch (error) {
      toast.error('Failed to generate palette');
    } finally {
      setLoading(false);
    }
  };

  const validateForFlexo = (colors) => {
    const issues = [];
    
    // Check color count
    if (colors.length > 6) {
      issues.push('Too many colors for efficient flexo printing');
    }
    
    // Check for very similar colors
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        if (getColorDistance(colors[i].hex, colors[j].hex) < 30) {
          issues.push(`${colors[i].name} and ${colors[j].name} are too similar`);
        }
      }
    }
    
    // Check substrate compatibility
    if (substrateType === 'clear') {
      const hasOpaque = colors.some(color => {
        const [, , l] = hexToHsl(color.hex);
        return l < 80; // Dark enough to show on clear
      });
      if (!hasOpaque) {
        issues.push('Needs darker colors for clear substrate');
      }
    }
    
    return issues;
  };

  const copyPaletteToClipboard = (palette) => {
    const text = palette.colors.map(color => 
      `${color.name}: ${color.hex} (CMYK: ${color.cmyk.join(', ')})`
    ).join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Palette copied to clipboard!');
    });
  };

  // Utility functions
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 1/6) [r, g, b] = [c, x, 0];
    else if (h < 2/6) [r, g, b] = [x, c, 0];
    else if (h < 3/6) [r, g, b] = [0, c, x];
    else if (h < 4/6) [r, g, b] = [0, x, c];
    else if (h < 5/6) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToCmyk = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
  };

  const findClosestPantone = (hex) => {
    // Simplified - in real implementation, you'd have a comprehensive Pantone database
    const distance = (h1, h2) => {
      const [r1, g1, b1] = [parseInt(h1.slice(1, 3), 16), parseInt(h1.slice(3, 5), 16), parseInt(h1.slice(5, 7), 16)];
      const [r2, g2, b2] = [parseInt(h2.slice(1, 3), 16), parseInt(h2.slice(3, 5), 16), parseInt(h2.slice(5, 7), 16)];
      return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
    };

    let closest = flexoStandardColors[0];
    let minDistance = distance(hex, closest.hex);

    flexoStandardColors.forEach(color => {
      const d = distance(hex, color.hex);
      if (d < minDistance) {
        minDistance = d;
        closest = color;
      }
    });

    return closest.pantone;
  };

  const getColorDistance = (hex1, hex2) => {
    const [r1, g1, b1] = [parseInt(hex1.slice(1, 3), 16), parseInt(hex1.slice(3, 5), 16), parseInt(hex1.slice(5, 7), 16)];
    const [r2, g2, b2] = [parseInt(hex2.slice(1, 3), 16), parseInt(hex2.slice(3, 5), 16), parseInt(hex2.slice(5, 7), 16)];
    return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-primary-600" />
          Flexo Color Palette Generator
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1 inline" />
          Advanced Options
        </button>
      </div>

      {/* Advanced Controls */}
      {showAdvanced && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Harmony
              </label>
              <select
                value={harmonyType}
                onChange={(e) => setHarmonyType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {Object.entries(harmonyTypes).map(([key, harmony]) => (
                  <option key={key} value={key}>
                    {harmony.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Substrate Type
              </label>
              <select
                value={substrateType}
                onChange={(e) => setSubstrateType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {Object.entries(substrateTypes).map(([key, substrate]) => (
                  <option key={key} value={key}>
                    {substrate.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateCustomPalette}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <BeakerIcon className="h-4 w-4 mr-2" />
            )}
            Generate Custom Palette
          </button>
        </div>
      )}

      {/* Generated Palettes */}
      <div className="space-y-4">
        {generatedPalettes.map((palette) => {
          const validationIssues = validateForFlexo(palette.colors);
          
          return (
            <div key={palette.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{palette.name}</h4>
                  <p className="text-xs text-gray-500">{palette.colors.length} colors</p>
                </div>
                <div className="flex items-center space-x-2">
                  {palette.flexoOptimized && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      <CpuChipIcon className="h-3 w-3 mr-1" />
                      Flexo Optimized
                    </span>
                  )}
                  <button
                    onClick={() => copyPaletteToClipboard(palette)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy to clipboard"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Color Swatches */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {palette.colors.map((color, index) => {
                  const isSelected = selectedColors.some(c => c.hex === color.hex);
                  
                  return (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary-500 ring-2 ring-primary-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => onColorSelect && onColorSelect(color)}
                    >
                      <div
                        className="w-full h-16 rounded-md border border-gray-300 mb-2"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-xs">
                        <div className="font-medium text-gray-900 truncate">{color.name}</div>
                        <div className="text-gray-500">{color.hex}</div>
                        <div className="text-gray-500">
                          CMYK: {color.cmyk.join(', ')}
                        </div>
                        {color.pantone && (
                          <div className="text-gray-500">
                            {color.pantone}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckIcon className="h-4 w-4 text-primary-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Validation Issues */}
              {validationIssues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center mb-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      Flexo Printing Considerations:
                    </span>
                  </div>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {validationIssues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Colors Summary */}
      {selectedColors.length > 0 && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <h4 className="font-medium text-primary-900 mb-2">
            Selected Colors ({selectedColors.length}/{maxColors})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color, index) => (
              <div
                key={index}
                className="inline-flex items-center space-x-2 bg-white rounded-md px-3 py-1 border border-primary-300"
              >
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm text-gray-900">{color.name}</span>
                <button
                  onClick={() => onColorSelect && onColorSelect(color)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteGenerator; 