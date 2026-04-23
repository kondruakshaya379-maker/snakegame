export const GAME_SETTINGS = {
    GRID_SIZE: 20,
    INITIAL_SPEED: 150,
    SPEED_INCREMENT: 2,
    MIN_SPEED: 50,
};

export interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
    duration: string;
}

// Using reliable public domain/creative commons sound clips as "Dummy AI Music"
export const DUMMY_TRACKS: Track[] = [
    {
        id: 'track-1',
        title: 'Neon Pulse Generation',
        artist: 'AI Model Alpha-7',
        url: 'https://actions.google.com/sounds/v1/science_fiction/sci_fi_computer_processing.ogg',
        duration: '0:45'
    },
    {
        id: 'track-2',
        title: 'Cybernetic Drift',
        artist: 'Neural Net Beta',
        url: 'https://actions.google.com/sounds/v1/science_fiction/space_engine_low.ogg',
        duration: '1:12'
    },
    {
        id: 'track-3',
        title: 'Void Echoes',
        artist: 'DeepMind Synth',
        url: 'https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg',
        duration: '0:58'
    }
];
