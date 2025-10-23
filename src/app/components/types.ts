export interface ExtendedMediaTrackConstraints extends MediaTrackConstraints {
  focusMode?: string;
  focusDistance?: number;
}

export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  focusMode?: string[];
  focusDistance?: {
    max: number;
    min: number;
    step: number;
  };
}

