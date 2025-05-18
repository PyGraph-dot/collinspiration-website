import Link from "next/link"
import { BarChart3, BookOpen, DollarSign, Download, Plus, Star, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your books today.</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-2xl font-bold">120</div>
              <div className="ml-2 text-xs font-medium text-green-500 flex items-center">
                <span className="i-lucide-arrow-up mr-1"></span>
                12%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">From last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-2xl font-bold">$8,459</div>
              <div className="ml-2 text-xs font-medium text-green-500 flex items-center">
                <span className="i-lucide-arrow-up mr-1"></span>
                8.2%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">From last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Users size={20} />
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-2xl font-bold">1,352</div>
              <div className="ml-2 text-xs font-medium text-green-500 flex items-center">
                <span className="i-lucide-arrow-up mr-1"></span>
                5.3%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">From last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Star size={20} />
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-2xl font-bold">4.8</div>
              <div className="ml-2 text-xs font-medium text-green-500 flex items-center">
                <span className="i-lucide-arrow-up mr-1"></span>
                0.4
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">From last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Visitor Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Books */}
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Books</CardTitle>
            <Link href="/admin/books" className="text-primary text-sm font-medium">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">The Art of English Grammar</div>
                          <div className="text-xs text-muted-foreground">By Mr. Collins</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">Grammar</td>
                    <td className="px-4 py-4 text-sm">245</td>
                    <td className="px-4 py-4 text-sm">4.8</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Published
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">Advanced Composition Techniques</div>
                          <div className="text-xs text-muted-foreground">By Mr. Collins</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">Writing</td>
                    <td className="px-4 py-4 text-sm">187</td>
                    <td className="px-4 py-4 text-sm">4.6</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Published
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">Literary Analysis for Students</div>
                          <div className="text-xs text-muted-foreground">By Mr. Collins</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">Literature</td>
                    <td className="px-4 py-4 text-sm">156</td>
                    <td className="px-4 py-4 text-sm">4.9</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Published
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
