import { Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import NotFound from './pages/NotFound.jsx'
import TrainingHub from './pages/TrainingHub.jsx'
import TrainingCountry from './pages/TrainingCountry.jsx'
import Employers from './pages/Employers.jsx'
import AgritechSolutions from './pages/AgritechSolutions.jsx'
import { destinations } from './content/seoPages.js'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminPostEditor from './pages/admin/AdminPostEditor.jsx'
import AdminInvoiceList from './pages/admin/AdminInvoiceList.jsx'
import AdminInvoiceForm from './pages/admin/AdminInvoiceForm.jsx'
import AdminInvoiceDetail from './pages/admin/AdminInvoiceDetail.jsx'
import AdminInvoiceAudit from './pages/admin/AdminInvoiceAudit.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* SEO landing pages. Content lives in src/content/seoPages.js; add a
            destination there and its /training/<slug> route appears here. */}
        <Route path="/training" element={<TrainingHub />} />
        {destinations.map((destination) => (
          <Route
            key={destination.slug}
            path={`/training/${destination.slug}`}
            element={<TrainingCountry key={destination.slug} destination={destination} />}
          />
        ))}
        <Route path="/hire-herd-managers" element={<Employers />} />
        <Route path="/agritech-solutions" element={<AgritechSolutions />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new" element={<AdminPostEditor />} />
        <Route path="/admin/edit/:slug" element={<AdminPostEditor />} />
        <Route path="/admin/invoices" element={<AdminInvoiceList />} />
        <Route path="/admin/invoices/new" element={<AdminInvoiceForm />} />
        <Route path="/admin/invoices/audit" element={<AdminInvoiceAudit />} />
        <Route path="/admin/invoices/:id" element={<AdminInvoiceDetail />} />
      </Route>
    </Routes>
  )
}
