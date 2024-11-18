import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Type definitions
interface SearchResult {
    id: string;
    title: string;
    description: string;
    type: 'page-content' | 'api';
}

interface HighlightProps {
    text: string;
    query: string;
}

// Utility function to highlight matching text
const Highlight: React.FC<HighlightProps> = ({ text, query }) => {
    if (!query) return <>{text}</>;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</span>
                ) : (
                    part
                )
            )}
        </span>
    );
};

const SearchComponent: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);

    // Debounced search function
    const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
        let timeout: NodeJS.Timeout | null = null;
        return (...args: Parameters<T>) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // API search function
    const searchAPI = async (searchTerm: string): Promise<void> => {
        if (!searchTerm) {
            setResults([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Search request failed');
            }

            const data: SearchResult[] = await response.json();
            setResults(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = debounce((searchTerm: string) => {
        searchAPI(searchTerm);
    }, 300);

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            className="w-full pl-10"
                        />
                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Card className="w-full border-0 shadow-none">
                        <CardContent className="p-4">
                            {error ? (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : loading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : results.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    {value ? "No results found." : "Start typing to search..."}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {results.map((result) => (
                                        <Button
                                            key={result.id}
                                            variant="ghost"
                                            className="w-full justify-start text-left h-auto py-3"
                                            onClick={() => {
                                                setValue(result.title);
                                                setOpen(false);
                                                if (result.type === 'page-content') {
                                                    document.getElementById(result.id)?.scrollIntoView({
                                                        behavior: 'smooth',
                                                    });
                                                }
                                            }}
                                        >
                                            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    <Highlight text={result.title} query={value} />
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    <Highlight text={result.description} query={value} />
                                                </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SearchComponent;
