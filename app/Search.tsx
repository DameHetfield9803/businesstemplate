import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, AlertCircle, Clock, FileText } from 'lucide-react';
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
interface PageContentItem {
    id: string;
    text: string;
    type: string;
}

interface SearchHistoryItem {
    term: string;
    timestamp: string;
}

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
    if (!query) return text;

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
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const [pageContent, setPageContent] = useState<PageContentItem[]>([]);

    // Initialize page content on mount
    useEffect(() => {
        const textContent: PageContentItem[] = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
            .map(element => ({
                id: element.id || Math.random().toString(36).substr(2, 9),
                text: element.textContent || '',
                type: element.tagName.toLowerCase()
            }));
        setPageContent(textContent);
    }, []);

    // Debounce function
    const debounce = <T extends (...args: any[]) => void>(
        func: T,
        wait: number
    ) => {
        let timeout: NodeJS.Timeout | null = null;

        return (...args: Parameters<T>) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // API search function
    const searchAPI = async (searchTerm: string): Promise<SearchResult[]> => {
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
            return data;
        } catch (error) {
            throw new Error('Failed to fetch search results');
        }
    };

    // Search in page content
    const searchPageContent = (searchTerm: string): SearchResult[] => {
        if (!searchTerm) return [];

        return pageContent
            .filter(content =>
                content.text.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(content => ({
                id: content.id,
                title: `Found in ${content.type}`,
                description: content.text.substring(0, 100) + '...',
                type: 'page-content' as const
            }));
    };

    // Combined search function
    const handleSearch = debounce(async (searchTerm: string) => {
        if (!searchTerm) {
            setResults([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Search in page content
            const pageResults = searchPageContent(searchTerm);

            // Search API
            const apiResults = await searchAPI(searchTerm);

            // Combine results
            const combinedResults: SearchResult[] = [
                ...pageResults,
                ...apiResults.map(result => ({ ...result, type: 'api' as const }))
            ];

            setResults(combinedResults);

            // Add to search history
            if (searchTerm.length > 2) {
                setSearchHistory(prev => {
                    const newHistory = [
                        { term: searchTerm, timestamp: new Date().toISOString() },
                        ...prev.filter(item => item.term !== searchTerm)
                    ].slice(0, 5);
                    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                    return newHistory;
                });
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, 300);

    // Load search history on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory) as SearchHistoryItem[];
                setSearchHistory(parsedHistory);
            } catch (error) {
                console.error('Failed to parse search history:', error);
                localStorage.removeItem('searchHistory');
            }
        }
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto p-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setValue(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            className="w-full pl-10"
                        />
                        <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-gray-400" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Card className="w-full border-0 shadow-none">
                        <CardContent className="p-2">
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
                                <>
                                    <div className="text-center py-4 text-gray-500">
                                        {value ? "No results found." : "Start typing to search..."}
                                    </div>
                                    {searchHistory.length > 0 && !value && (
                                        <div className="border-t pt-2">
                                            <div className="text-sm font-medium text-gray-500 mb-2">Recent searches</div>
                                            {searchHistory.map((item, index) => (
                                                <Button
                                                    key={index}
                                                    variant="ghost"
                                                    className="w-full justify-start text-left h-auto py-2"
                                                    onClick={() => {
                                                        setValue(item.term);
                                                        handleSearch(item.term);
                                                    }}
                                                >
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    {item.term}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </>
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
                                                        behavior: 'smooth'
                                                    });
                                                }
                                            }}
                                        >
                                            {result.type === 'page-content' ? (
                                                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                                            ) : (
                                                <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                                            )}
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