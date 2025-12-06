import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchExpenses, updateCurrentPage } from "../features/expenses/transactionSlice";

export default function ExpenseTable() {
    const dispatch = useDispatch();
    const expenses = useSelector((state) => state.transactions.list);
    const totalPages = useSelector((state) => state.transactions.totalPages || 1);
    const currentPage = useSelector((state) => state.transactions.currentPage || 1);
    const totalCount = useSelector((state) => state.transactions.totalCount || 0);
    const loading = useSelector((state) => state.transactions.loading);

    // Fetch expenses on initial load
    useEffect(() => {
        dispatch(fetchExpenses({ page: 1 }));
    }, [dispatch]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            dispatch(fetchExpenses({ page: currentPage - 1 }));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            console.log("call reached")

            dispatch(fetchExpenses({ page: currentPage + 1 }));
            dispatch(updateCurrentPage(currentPage + 1));
        }
    };

    const handlePageClick = (pageNum) => {
        dispatch(fetchExpenses({ page: pageNum }));
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (!expenses || expenses.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-pink-100">
                <p className="text-gray-500">No expenses yet. Start tracking! 🌸</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-pink-100">
                <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Showing {20 * (currentPage - 1) + 1}-{20 * currentPage} of {totalCount} expenses
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-pink-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Category</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense._id} className="hover:bg-pink-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {expense.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-semibold text-rose-600">
                                        ₹{expense.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-pink-100 flex items-center justify-between">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((pageNum, idx) => (
                            pageNum === '...' ? (
                                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageClick(pageNum)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                            }`}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}