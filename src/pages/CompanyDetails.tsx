import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Company } from "./Clients";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/components/button";
import { PlusIcon } from "lucide-react";
import { DataSourcesTable, DataSource } from "../components/DatasourcesTable.tsx";
import { AddDataSourceCard } from "../components/AddDataSourceCard";
import { EditDataSourceSheet } from "../components/EditDataSourceSheet";

// Sample companies (in a real app, this would come from an API or global state)
const initialCompanies: Company[] = [
  {
    id: "1",
    name: "Tech Innovations Inc",
    industry: "Technology",
    website: "techinnovations.com",
    address: "123 Tech Avenue, Silicon Valley, CA",
    notes: "Leading AI solutions provider",
    status: "Active",
  },
  {
    id: "2",
    name: "Green Energy Solutions",
    industry: "Energy",
    website: "greenenergysolutions.com",
    address: "456 Renewable Road, Portland, OR",
    notes: "Focused on sustainable energy solutions",
    status: "Potential",
  },
  {
    id: "3",
    name: "Global Finance Group",
    industry: "Finance",
    website: "globalfinance.com",
    address: "789 Wall Street, New York, NY",
    notes: "International investment banking",
    status: "Active",
  },
];

// Sample data sources
const initialDataSources: Record<string, DataSource[]> = {
  "1": [
    {
      id: "ds1",
      name: "Company Website",
      type: "website",
      status: "Processed",
      link: "techinnovations.com"
    },
    {
      id: "ds2",
      name: "Annual Report 2024",
      type: "pdf",
      status: "In queue",
      filename: "annual_report_2024.pdf"
    }
  ],
  "2": [
    {
      id: "ds3",
      name: "Green Energy Blog",
      type: "website",
      status: "Not extracted",
      link: "blog.greenenergysolutions.com"
    }
  ],
  "3": [
    {
      id: "ds4",
      name: "Financial Report Q1",
      type: "excel",
      status: "Extracting",
      filename: "financial_report_q1.xlsx"
    }
  ]
};

export const CompanyDetails = (): JSX.Element => {
  const { companyId } = useParams<{ companyId: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [company, setCompany] = useState<Company | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [showAddDataSourceCard, setShowAddDataSourceCard] = useState(false);
  const [editDataSource, setEditDataSource] = useState<DataSource | null>(null);

  // Create breadcrumbs directly with the company name when available
  const breadcrumbItems = React.useMemo(() => {
    // Use a simplified approach to create breadcrumbs
    const baseBreadcrumbs = [
      { label: "Home", path: "/" },
      { label: "Clients", path: "/clients" }
    ];
    
    // Add the company name as the last breadcrumb if it's available
    if (company) {
      baseBreadcrumbs.push({
        label: company.name,
        path: `/clients/${companyId}`
      });
    }
    
    return baseBreadcrumbs;
  }, [companyId, company]);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCompany = initialCompanies.find(c => c.id === companyId);
    setCompany(foundCompany || null);
    
    // Load data sources for this company
    if (companyId) {
      setDataSources(initialDataSources[companyId] || []);
    }
  }, [companyId]);

  const addDataSource = (dataSource: Omit<DataSource, "id">) => {
    const newDataSource = {
      ...dataSource,
      id: Math.random().toString(36).substring(2, 9)
    };
    setDataSources([...dataSources, newDataSource]);
    setShowAddDataSourceCard(false);
  };

  const updateDataSource = (updatedDataSource: DataSource) => {
    setDataSources(dataSources.map(ds => 
      ds.id === updatedDataSource.id ? updatedDataSource : ds
    ));
    setEditDataSource(null);
  };

  if (!company) {
    return (
      <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen p-6 transition-colors duration-300 flex items-center justify-center`}>
        <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Company not found
        </p>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-[#100e24]' : 'bg-gray-100'} flex-1 h-screen transition-colors duration-300 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Simplified breadcrumb implementation that doesn't rely on async resolution */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Company Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {company.name}
          </h1>
          <div className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {company.industry} | {company.status}
          </div>
        </div>

        {/* Company Details Card */}
        <div className={`rounded-lg shadow-md p-6 mb-8 ${
          isDark ? 'bg-[#17162e] text-white' : 'bg-white text-gray-800'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Company Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Website</span>
                  <a 
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {company.website}
                  </a>
                </div>
                <div>
                  <span className={`block text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Address</span>
                  <p>{company.address}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Additional Notes
              </h2>
              <p className={`${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {company.notes || 'No additional notes'}
              </p>
            </div>
          </div>
        </div>

        {/* Data Sources Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Data Sources
            </h2>
            <Button
              onClick={() => setShowAddDataSourceCard(true)}
              className={`${
                isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Data Source
            </Button>
          </div>

          {/* Data Sources Table */}
          <DataSourcesTable 
            dataSources={dataSources} 
            isDark={isDark}
            onEditClick={(dataSource) => setEditDataSource(dataSource)}
          />
        </div>

        {/* Add Data Source Card Modal */}
        {showAddDataSourceCard && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <AddDataSourceCard
              onAdd={addDataSource}
              onCancel={() => setShowAddDataSourceCard(false)}
              isDark={isDark}
            />
          </div>
        )}

        {/* Edit Data Source Sheet */}
        <EditDataSourceSheet
          dataSource={editDataSource}
          onUpdate={updateDataSource}
          onClose={() => setEditDataSource(null)}
          open={editDataSource !== null}
          isDark={isDark}
        />
      </div>
    </div>
  );
};