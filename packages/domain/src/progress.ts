export function isMastered(input: {
  theoryComplete: boolean;
  practiceComplete: boolean;
  checkpointComplete: boolean;
}): boolean {
  return input.theoryComplete && input.practiceComplete && input.checkpointComplete;
}
