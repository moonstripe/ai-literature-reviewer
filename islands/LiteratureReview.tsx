import { LiteratureReviewProps } from "../types.ts";
export default function LiteratureReview({ literatureReviewResults }: LiteratureReviewProps) {
    return literatureReviewResults.value.length > 0 ? (
        <div class="flex flex-col w-full mt-8">
            <h1 class="text-xl mb-4">Literature Review:</h1>
            {
                literatureReviewResults.value.map(literatureReviewResult => (
                    <div dangerouslySetInnerHTML={{ __html: literatureReviewResult}} class="mb-2"/>
                ))
            }
        </div>
    ) : null
}