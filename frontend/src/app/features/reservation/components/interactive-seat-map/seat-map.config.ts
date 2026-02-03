// Just zina pour frontend, par défaut

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

export const SECTION_CONFIGS: SectionConfig[] = [
    {
        name: 'Fosse Or',
        seatsPerRow: 12,
        layout: 'single',
    },
    {
        name: 'Catégorie 1',
        seatsPerRow: 6,
        layout: 'triple',
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