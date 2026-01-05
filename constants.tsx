
import { Unit } from './types';

export const getDriveDirectUrl = (id: string): string => {
  // Visor oficial de Google Docs para forzar el embebido y evitar errores de visualización/descarga
  return `https://docs.google.com/viewer?embedded=true&url=https://drive.google.com/uc?id=${id}`;
};

export const UNITS: Unit[] = [
  {
    id: 'unit1',
    title: 'Unidad I. Bases y principios de la agroecología.',
    description: 'Fundamentos ecológicos y sociales de la agroecología moderna.',
    lessons: [
      { id: '1.1', title: '1.1 Introducción a la Agroecología', driveId: '1QjkNlKIvl1flQCsDYRxBiXGwQD6IKk89' },
      { id: '1.2', title: '1.2 Ecología, Importancia y relación', driveId: '1E-df8olvItlfu9Qbba7DWdS1T29HmH7p' },
      { id: '1.3', title: '1.3 Productos y beneficios', driveId: '1RKueIsdRes9CoWN9hRrP9mmwM_SL24Rk' },
      { id: '1.4', title: '1.4 Calentamiento Global y efectos', driveId: '1yUNBtdmnKpJBCYHHkSBl7TB89yvy3hk9' }
    ]
  },
  {
    id: 'unit2',
    title: 'Unidad II. Gestión ambiental: uso y manejo sustentable de recursos para la producción.',
    description: 'Políticas y técnicas de gestión ambiental sustentable.',
    lessons: [
      { id: '2.1', title: '2.1 Influencia de la agricultura', driveId: '1CoFkaubT2wKWJw1nHUX7U2OO6F7zdz82' },
      { id: '2.2', title: '2.2 Política medioambiental', driveId: '1GVouBWicD4zpJZb2YlWLoUb4NmyUxdAM' },
      { id: '2.3', title: '2.3 Frontera agrícola', driveId: '1Ef3eFPxQL5QmCR15NT2xIzDCgsL6Ntur' },
      { id: '2.4', title: '2.4 Agricultura biodinámica', driveId: '1s0qblz9MrfcjF3Cm1_eTZjCs6lyUHx3d' },
      { id: '2.5', title: '2.5 Agricultura orgánica y natural', driveId: '1nnBFTJ1p_WgQtxqNWHABOy1EIk6wOY_p' },
      { id: '2.6', title: '2.6 Agricultura ecológica y permacultura', driveId: '13WF_OgIG31zwYfMT4QlrwAYR1WWlMKxx' },
      { id: '2.7', title: '2.7 Restauración de agroecosistemas', driveId: '1vc6rIwtJgtRcxBllZcmmGRp1yPJeapF4' }
    ]
  },
  {
    id: 'unit3',
    title: 'Unidad III. Técnicas agroecológicas.',
    description: 'Métodos prácticos para el manejo ecológico del campo.',
    lessons: [
      { id: '3.1', title: '3.1 Manejo de suelo y labranza', driveId: '1wqrw9fZfnnT-bQthDQP2DU6NEa5uDXyZ' },
      { id: '3.2', title: '3.2 Microorganismos eficientes (EM)', driveId: '1VOKsUbo6Hr1xLqeVQGU350SoC4wPqK1W' },
      { id: '3.3', title: '3.3 Principio del manejo de plagas', driveId: '1IBLY99nlDyMKE1BE9Sm9nUiN5vusasfG' },
      { id: '3.4', title: '3.4 La Biorremediación en agricultura', driveId: '1izew5ckvXosEpGCApNzLwBvhTCeNuWbX' }
    ]
  },
  {
    id: 'unit4',
    title: 'Unidad IV. Bioinsumos y manejo agroecológico técnicas agroecológicas.',
    description: 'Producción de insumos biológicos y control natural.',
    lessons: [
      { id: '4.1', title: '4.1 Bioinsecticidas y repelentes', driveId: '1iXrYKtUQNJSKgJCT8pEK1PlVKtCmAXeo' },
      { id: '4.2', title: '4.2 Abonos orgánicos y permacultura', driveId: '1jS4Ql7An-LMDhT7KNLycE6DUbOVq6LdF' },
      { id: '4.3', title: '4.3 Manejo Agroecológico de plagas', driveId: '1wn0AbQqvuC-HjCuOImL-sb_9feAmtAYy' }
    ]
  }
];
