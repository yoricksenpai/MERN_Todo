import './App.css'
import { Routes, Route } from "react-router-dom";
import LoginRegisterPage from './pages/auth/LoginAndRegister';
import TodoListMainPage from './pages/MainPage';
import AddListPage from './pages/AddListPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import Header from './components/Header';
import Footer from './components/Footer'
import NotificationList from './components/Notifications';
import { UserContextProvider } from './contexts/UserContext'
/**
 * Main application component.
 *
 * Renders the main header, footer, and routes for the application.
 *
 * @return {JSX.Element} The rendered application component.
 */
function App() {
  return (
    <UserContextProvider>
  <div className="font-sans font-semibold bg-[#F8F7F4] min-h-screen flex flex-col ">
    <Header />
            <main className="flex-grow overflow-x-hidden">
    <Routes>
      <Route index element={<TodoListMainPage />} />
      <Route path='/login_register' element={<LoginRegisterPage />} />
      <Route path='/add_list' element={<AddListPage />} />
      <Route path='/manage_categories' element={<ManageCategoriesPage />} />
      <Route path='/create_task' element={<CreateTaskPage />} />
      <Route path='/edit_task/:id' element={<EditTaskPage/>}/>
          </Routes>
                  <NotificationList />

          </main>
        <Footer />
      </div>
    </UserContextProvider>
  )
}

export default App
