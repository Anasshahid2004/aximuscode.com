"use client";

// No real search index exists to query against, so this just guards
// against a real page navigation on submit - kept as its own small client
// component so app/blog/page.tsx can stay a Server Component (it needs to,
// to export `metadata`).
export default function BlogSearchForm() {
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <input type="text" placeholder="Search..." aria-label="Search" />
      <button type="submit" aria-label="Search">
        <i className="fa-solid fa-magnifying-glass" />
      </button>
    </form>
  );
}
