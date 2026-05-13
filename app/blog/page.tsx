import { BlogPageContent } from "@/components/static-page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("blog", "tr", "/blog")

export default function BlogPage() {
  return <BlogPageContent locale="tr" />
}
