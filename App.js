import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Something went wrong.</AlertTitle>
                    <AlertDescription>
                        We're sorry, an error occurred while trying to display the blog posts.
                        Please try again later.
                    </AlertDescription>
                </Alert>
            );
        }

        return this.props.children;
    }
}

// BlogPostList Component
const BlogPostList = ({ posts }: { posts: { id: number; title: string; body: string }[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <Card key={post.id} className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{post.body}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// App Component
const App = () => {
    const [posts, setPosts] = useState<{ id: number; title: string; body: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
                setPosts(response.data);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Loading Posts...</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-full mb-2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-[80%]" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <Button
                        variant="outline"
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Blog Posts</h1>
            <ErrorBoundary>
                <BlogPostList posts={posts} />
            </ErrorBoundary>
        </div>
    );
};

export default App;
