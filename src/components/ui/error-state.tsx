import { FeedbackState } from './feedback-state';

type Props = Omit<Parameters<typeof FeedbackState>[0], 'tone'>;
export function ErrorState(props: Props) { return <FeedbackState {...props} tone="error" />; }
