
export type PartCategory = 'cpu' | 'gpu' | 'ram' | 'psu';
export type Part = {
    id: string;
    name: string;
    price: number;
    category: PartCategory;
    watts?: number;
    socket?: string;
    memory?: number;
    maxWatts?: number;
    inStock: boolean;
}
export type PCState = {
    cpu: Part | null;
    gpu: Part | null;
    ram: Part | null;
    psu: Part | null;
}

export type PCAction =
    | { type: 'SELECT_PART'; payload: Part }
    | { type: 'REMOVE_PART'; payload: PartCategory }
    | { type: 'RESET_BUILD' };

export const initialState: PCState = {
    cpu: null,
    gpu: null,
    ram: null,
    psu: null
};



export function pcReducer(state: PCState, action: PCAction): PCState {
    switch (action.type) {
        case 'SELECT_PART':
            return {
                ...state,
                [action.payload.category]: action.payload,
            };

        case 'REMOVE_PART':
            return {
                ...state,
                [action.payload]: null,
            };

        case 'RESET_BUILD':
            return initialState;

        default:
            return state;
    }
}
