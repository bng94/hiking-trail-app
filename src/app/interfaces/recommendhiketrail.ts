export interface RecommendHikeTrail {
    trailName: string;
    trailLocation: string;
    trailImg: string;
    trailURL: string;
    trailLatitude: number;
    trailLongitude: number;
}

export interface RecommendHikeTrails extends Array<RecommendHikeTrail> {}
