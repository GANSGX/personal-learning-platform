import { compileMDX } from "next-mdx-remote/rsc";

const lessonComponents = {};

type LessonBodyProps = {
  source: string;
};

export async function LessonBody({ source }: LessonBodyProps) {
  const { content } = await compileMDX({
    source,
    components: lessonComponents,
  });

  return <article className="lesson-prose">{content}</article>;
}
