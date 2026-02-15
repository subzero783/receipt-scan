import { useMemo } from 'react';

const ExpenseBreakdown = ({ data, receipts = [] }) => {

    const { topCategories, chartData } = useMemo(() => {
        if (!receipts || receipts.length === 0) {
            return { topCategories: [], chartData: [] };
        }

        const totalExpenses = receipts.reduce((sum, r) => sum + r.totalAmount, 0);
        const categoryTotals = receipts.reduce((acc, r) => {
            const cat = r.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + r.totalAmount;
            return acc;
        }, {});

        const categories = Object.entries(categoryTotals)
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
            }))
            .sort((a, b) => b.amount - a.amount);

        // Assign colors dynamically
        const colors = ['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb']; // Blue shades

        const categoriesWithColors = categories.map((cat, index) => ({
            ...cat,
            color: colors[index % colors.length]
        }));

        return {
            topCategories: categoriesWithColors.slice(0, 3),
            chartData: categoriesWithColors
        };
    }, [receipts]);

    // Construct Conic Gradient for Pie Chart
    const pieChartGradient = useMemo(() => {
        if (chartData.length === 0) return 'conic-gradient(#e5e7eb 0% 100%)';

        let gradientString = 'conic-gradient(';
        let startPercent = 0;

        chartData.forEach((cat, index) => {
            const endPercent = startPercent + cat.percentage;
            gradientString += `${cat.color} ${startPercent}% ${endPercent}%${index < chartData.length - 1 ? ', ' : ''}`;
            startPercent = endPercent;
        });

        // Fill remaining with gray if < 100 due to rounding
        if (startPercent < 100) {
            gradientString += `, #e5e7eb ${startPercent}% 100%`;
        }

        gradientString += ')';
        return gradientString;
    }, [chartData]);


    return (
        <section className="expense-breakdown-section">
            <div className="container">
                <div className="top-text">
                    <div className="small-title">{data.small_title}</div>
                    <h2 className="title">{data.title}</h2>
                    <p className="subtitle">{data.subtitle}</p>
                </div>

                <div className="breakdown-content">
                    {/* LEFT: Top 3 Categories */}
                    <div className="categories-list">
                        {topCategories.length > 0 ? (
                            topCategories.map((cat, index) => (
                                <div key={index} className="category-card">
                                    <div className="cat-percent">{cat.percentage}%</div>
                                    <div className="cat-name">{cat.name}</div>
                                </div>
                            ))
                        ) : (
                            <div className="category-card">
                                <div className="cat-name">No data available</div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Pie Chart */}
                    <div className="chart-container">
                        <div className="pie-chart" style={{ background: pieChartGradient }}>
                            <div className="chart-hole"></div>
                        </div>
                        <div className="chart-legend">
                            {chartData.slice(0, 5).map((cat, index) => (
                                <div key={index} className="legend-item">
                                    <span className="legend-dot" style={{ background: cat.color }}></span>
                                    <span className="legend-text">{cat.name} ({cat.percentage}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpenseBreakdown;