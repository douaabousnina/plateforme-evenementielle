// TODO: to change according to backend
export interface SectionConfig {
    name: string;
    seatsPerRow: number;
    layout?: 'single' | 'triple' | 'curved';
    style?: {
        rotation?: number;
        opacity?: number;
        borderColor?: string;
    };
}

// TODO: hardcoded for now
export const SECTION_CONFIGS: SectionConfig[] = [
    {
        name: 'Fosse Or',
        seatsPerRow: 12,
        layout: 'single',
    },
    {
        name: 'Catégorie 1',
        seatsPerRow: 6,
        layout: 'triple', // Will be split into left (4), center (6), right (4)
        style: {
            rotation: 6,
            borderColor: 'purple',
        },
    },
    {
        name: 'Balcon',
        seatsPerRow: 10,
        layout: 'single',
        style: {
            opacity: 0.7,
            borderColor: 'blue',
        },
    },
];