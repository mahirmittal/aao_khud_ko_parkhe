"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Users, User, Lock, ChevronRight, Shield } from "lucide-react"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HomePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [userType, setUserType] = useState("executive1")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setLoading(true)

    try {
      const apiEndpoint = userType === 'executive1' ? '/api/executive1/login' : '/api/admin/login'
      const response = await fetch(apiEndpoint.toLowerCase(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (userType === 'executive1') {
          localStorage.setItem("executive1LoggedIn", "true")
          localStorage.setItem("executive1Username", username)
          localStorage.setItem("executive1Type", data.user.type)
          localStorage.setItem("executive1Id", data.user.id)
          router.push("/feedback")
        } else {
          localStorage.setItem("adminLoggedIn", "true")
          localStorage.setItem("adminUsername", username)
          localStorage.setItem("adminUserId", data.user.id)
          router.push("/admin/dashboard")
        }
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Official Header */}
      <header className="bg-gradient-to-r from-orange-400 via-orange-500 to-green-500">
        <div className="container mx-auto px-4 py-4">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* <img
                src="https://cgstate.gov.in/user-assets/images/logo-cg.png"
                alt="Government of India"
                className="w-16 h-16 object-contain"
              /> */}
              <img
                src="https://cgstate.gov.in/user-assets/images/logo-cg.png"
                alt="Chhattisgarh Government"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">आओ खुद को परखें</h1>
                <p className="text-sm text-blue-800">छत्तीसगढ़ शासन | GOVERNMENT OF CHHATTISGARH</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                Apply Online
                <br />
                cgstate.gov.in
              </Button>
            </div>
          </div>

          {/* Officials Row */}
          {/* <div className="flex justify-center space-x-8 mb-4">
            {[
              { name: "Shri Raman Deka", title: "Hon. Governor, C.G." },
              { name: "Shri Vishnu Deo Sai", title: "Hon. Chief Minister, C.G." },
              { name: "Dr. Gaurav Kumar Singh", title: "Collector, Raipur" },
              { name: "Shri Vishwadeep", title: "Commissioner, Raipur" },
              { name: "Kumar Biswranjan", title: "Chief Executive1 Officer Panchayat" },
            ].map((official, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full mb-2 mx-auto flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-blue-900">{official.name}</p>
                <p className="text-xs text-blue-800">{official.title}</p>
              </div>
            ))}
          </div> */}
        </div>
      </header>

      {/* Government Schemes Ticker */}
      <div className="bg-green-600 text-white py-2 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2">
            <span className="bg-green-700 px-3 py-1 rounded text-sm font-bold">CG GOVERNMENT SCHEMES</span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap">
                <span className="inline-block px-8">
                  मुख्यमंत्री कन्या विवाह योजना - Financial assistance for girl child marriage
                </span>
                <span className="inline-block px-8">राजीव गांधी किसान न्याय योजना - Direct cash transfer to farmers</span>
                <span className="inline-block px-8">गोधन न्याय योजना - Cow dung procurement scheme</span>
                <span className="inline-block px-8">सुराजी गांव योजना - Rural development scheme</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Quick Links */}
          <div className="col-span-3">
            <Card className="mb-6">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {[
                    { name: "Chhattisgarh Government Portal", color: "border-l-green-500" },
                    { name: "Citizen Services", color: "border-l-blue-500" },
                    { name: "Online Applications", color: "border-l-orange-500" },
                    { name: "RTI Portal", color: "border-l-red-500" },
                    { name: "Employment Portal", color: "border-l-purple-500" },
                  ].map((link, index) => (
                    <div
                      key={index}
                      className={`p-3 border-l-4 ${link.color} hover:bg-gray-50 cursor-pointer flex items-center justify-between`}
                    >
                      <span className="text-sm">{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rajdhani Section - Sliding Cards */}
            <Card className="border-orange-300 overflow-hidden">
              <div className="relative h-40">
                {/* Hindi Card */}
                <div className="absolute inset-0 transition-transform duration-1000 ease-in-out animate-slide-hindi">
                  <CardHeader className="bg-orange-100 border-b border-orange-300">
                    <CardTitle className="text-orange-800 text-center">
                      ज़िला
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-6">
                    <h3 className="text-2xl font-bold text-red-600 mb-1">रायपुर जिला में आपका स्वागत है ||</h3>
                    <p className="text-sm text-gray-600">राजधानी शहर</p>
                  </CardContent>
                </div>

                {/* English Card */}
                <div className="absolute inset-0 transition-transform duration-1000 ease-in-out animate-slide-english">
                  <CardHeader className="bg-blue-100 border-b border-blue-300">
                    <CardTitle className="text-blue-800 text-center">
                      District
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center ">
                    <h3 className="text-2xl font-bold  text-blue-600 mb-1">Welcome to District Raipur</h3>
                   {/* <p className="text-sm text-gray-600">Capital City</p> */}
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>

          {/* Center Content */}
          <div className="col-span-6">
            <div className="">
              {/* <div className="text-center">
                <h2 className="text-4xl font-bold mb-2">Chhattisgarh</h2>
                <h3 className="text-3xl font-bold text-yellow-300 mb-4">full of Surprises</h3>
                <p className="text-lg mb-2">Welcome to the official portal</p>
                <p className="text-sm opacity-90">Access government services, information, and resources</p>
              </div> */}
            </div>

            {/* Secure Login Portal */}
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-center">
                <CardTitle className="text-lg">Secure Login Portal</CardTitle>
                <CardDescription className="text-gray-300">Government Officials & Citizens</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <Label htmlFor="userType" className="text-sm font-medium">
                      Login As
                    </Label>
                    <div className="relative mt-1">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      >
                        <option value="executive1">Executive</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username / Email ID
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 text-center">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-800" disabled={loading}>
                    {loading ? "Please wait..." : "Secure Login"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Link href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">For technical support: 0771-2234567</div>
              </CardContent>
            </Card>

            {/* How to Use Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("home.howToUse")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-3">{t("home.forExecutives")}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <p>{t("home.step1Exec")}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <p>{t("home.step2Exec")}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <p>{t("home.step3Exec")}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">{t("home.forAdmins")}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <p>{t("home.step1Admin")}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <p>{t("home.step2Admin")}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <p>{t("home.step3Admin")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Additional Information */}
          <div className="col-span-3">
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
                <CardTitle className="text-lg">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-semibold">Helpline Numbers</h4>
                    <p className="text-sm text-gray-600">Emergency: 112</p>
                    <p className="text-sm text-gray-600">Police: 100</p>
                    <p className="text-sm text-gray-600">Ambulance: 108</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <h4 className="font-semibold">Working Hours</h4>
                    <p className="text-sm text-gray-600">Mon-Fri: 10:00 AM - 5:30 PM</p>
                    <p className="text-sm text-gray-600">Sat: 10:00 AM - 2:00 PM</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <h4 className="font-semibold">Contact Us</h4>
                    <p className="text-sm text-gray-600">Email: support@cg.gov.in</p>
                    <p className="text-sm text-gray-600">Phone: 0771-2234567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Latest News Section */}
        <Card className="mt-6">
          <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🚨</span>
                <CardTitle>ताजा समाचार / Latest News</CardTitle>
                <span className="bg-orange-500 px-2 py-1 rounded text-xs font-bold">BREAKING</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                  ‹
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                  ›
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex space-x-4">
                <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                <div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">domestic</span>
                  <p className="text-sm font-medium mt-2">
                    कांकेर-कोंडागांव समेत 7 जिलों में भारी बारिश का अलर्ट:नारायणपुर से बिजली गिरेगी
                  </p>
                  <p className="text-xs text-gray-500 mt-1">19 जुलाई, 02:48 am</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">government</span>
                  <p className="text-sm font-medium mt-2">मुख्यमंत्री ने किया नई योजनाओं का शुभारंभ, किसानों को मिलेगा फायदा</p>
                  <p className="text-xs text-gray-500 mt-1">18 जुलाई, 06:30 pm</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                <div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">development</span>
                  <p className="text-sm font-medium mt-2">डिजिटल इंडिया मिशन के तहत नई सुविधाओं का विस्तार</p>
                  <p className="text-xs text-gray-500 mt-1">18 जुलाई, 04:15 pm</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-blue-900 to-green-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img
              src="https://cgstate.gov.in/user-assets/images/logo-cg.png"
              alt="Chhattisgarh Government Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h4 className="text-lg font-bold">{t("home.govChhattisgarh")}</h4>
              <p className="text-sm text-gray-400">{t("home.callCenterSystem")}</p>
            </div>
          </div>
          <p>{t("home.copyright")}</p>
          <p className="text-sm text-gray-400 mt-2">{t("home.internalUse")}</p>
        </div>
      </footer>
    </div>
  )
}
