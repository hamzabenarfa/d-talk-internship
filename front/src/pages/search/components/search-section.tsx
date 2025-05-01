import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormEvent } from "react"

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export function SearchSection({ searchTerm, setSearchTerm, handleSearch }: SearchSectionProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-pink-500">Realize your Career Dreams</p>
        <h1 className="text-5xl font-normal tracking-tight sm:text-5xl">
          Search and Discover
          <br />
          your Internship Here
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl flex-col gap-1 w-full items-center sm:flex-row border border-gray-200 rounded-2xl p-2">
        <div className="relative flex-1 w-full">
          <input
            className="w-full pl-10 h-11 focus:outline-none focus:ring-0"
            placeholder="Job title, keyword or company"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-6 w-5 text-muted-foreground" />
        </div>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-black/90 rounded-full w-full md:w-24"
        >
          Search
        </Button>
      </form>
    </div>
  )
}

