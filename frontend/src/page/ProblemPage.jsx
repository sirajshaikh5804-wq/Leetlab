import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
    Play,
    FileText,
    MessageSquare,
    Lightbulb,
    Bookmark,
    Share2,
    Clock,
    ChevronRight,
    BookOpen,
    Terminal,
    Code2,
    Users,
    ThumbsUp,
    Home,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useProblemStore } from "../store/useProblemStore";


const ProblemPage = () => {
    const { id } = useParams()
    const { getProblemById, problem, isProblemLoading } = useProblemStore()
    const [code, setCode] = useState("")
    const [activeTab, setActiveTab] = useState("description")
    const [selectedLanguage, setSelectedLanguage] = useState("javascript")
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [testCases, setTestCases] = useState([])


    const submissionCount = 10;

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang)
    }

    useEffect(() => {
        getProblemById(id)
    }, [id, getProblemById])

    useEffect(() => {
        if (problem) {
            setCode(problem.codeSnippets?.[selectedLanguage] || "")

            setTestCases(
                problem.testCases.map((tc) => ({
                    input: tc.input,
                    output: tc.output
                })) || []
            )
        }
    }, [problem, selectedLanguage])

    return problem && (
        <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200">
            {/* {isProblemLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            ) : problem ? ( */}
            <nav className="navbar bg-base-100 shadow-lg px-4">
                <div className="flex-1 gap-2">
                    <Link to={"/"} className="flex items-center gap-2 text-primary">
                        <Home className="w-6 h-6" />
                        <ChevronRight className="w-4 h-4" />
                    </Link>

                    <div className="mt-2">
                        <h1 className="text-xl font-bold">{problem.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
                            <Clock className="w-4 h-4" />
                            <span>
                                Updated{" "}
                                {problem.createdAt &&
                                    new Date(problem.createdAt).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                            </span>
                            <span className="text-base-content/30">•</span>
                            <Users className="w-4 h-4" />
                            <span>{submissionCount} Submissions</span>
                            <span className="text-base-content/30">•</span>
                            <ThumbsUp className="w-4 h-4" />
                            <span>95% Success Rate</span>
                        </div>
                    </div>
                </div>

                <div className="flex-none gap-4">
                    <button
                        className={`btn btn-ghost btn-circle ${isBookmarked ? "text-primary" : ""
                            }`}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost btn-circle">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <select
                        className="select select-bordered select-primary w-40 cursor-pointer"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                    >
                        {Object.keys(problem.codeSnippets || {}).map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </nav>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className=" bg-base-100 shadow-xl">
                        <div className="card-body p-0">
                            <div className="tabs tabs-border">
                                <button
                                    className={`tab gap-2 ${activeTab === "description" ? 'tab-active' : ""}`}
                                    onClick={() => setActiveTab("description")}
                                ><FileText className="w-4 h-4" />
                                    Description
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "submissions" ? 'tab-active' : ""}`}
                                    onClick={() => setActiveTab("submissions")}
                                > <Code2 className="w-4 h-4" />
                                    Submissions
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "discussion" ? "tab-active" : ""}`}
                                    onClick={() => setActiveTab("discussion")}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Discussion
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "hints" ? "tab-active" : ""}`}
                                    onClick={() => setActiveTab("hints")}
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    Hints
                                </button>
                            </div>

                            <div className="p-6">
                                {/* {renderTabContent()} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ) : (
                <p className="text-center text-error">Problem not found.</p>
            )} */}

        </div>
    );

}


export default ProblemPage