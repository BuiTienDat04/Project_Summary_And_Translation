import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#4F46E5", "#9333EA", "#F59E0B"]; // Màu sắc cho các phần

const StatisticsChart = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row items-center mt-4">
                {/* Biểu đồ */}
                <ResponsiveContainer width="50%" height={320}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            label={({ cx, cy, midAngle, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const x = cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN);
                                const y = cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN);
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill={COLORS[index % COLORS.length]}
                                        textAnchor={x > cx ? "start" : "end"}
                                        dominantBaseline="central"
                                        fontSize="14px"
                                        fontWeight="bold"
                                    >
                                        {data[index].value}
                                    </text>
                                );
                            }}
                            labelLine={false} // Ẩn đường line nhỏ nối nhãn
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Cards hiển thị số liệu */}
                <div className="flex flex-col gap-4 w-full md:w-1/2">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
                        >
                            <span className="text-lg font-semibold text-gray-700">{item.name}</span>
                            <span
                                className="text-xl font-bold"
                                style={{ color: COLORS[index % COLORS.length] }}
                            >
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatisticsChart;
