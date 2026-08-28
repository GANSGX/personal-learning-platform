import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

const lessonComponents = {};

type LessonBodyProps = {
  source: string;
};

export async function LessonBody({ source }: LessonBodyProps) {
  const compiled = String(
    await compile(source, {
      outputFormat: "function-body",
      development: process.env.NODE_ENV === "development",
    }),
  );
  const { default: Content } = await run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return (
    <article className="lesson-prose">
      <Content components={lessonComponents} />
    </article>
  );
}
