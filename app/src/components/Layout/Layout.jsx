import { Header } from './Header';



export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        {children}
        
      </main>
    
    </div>
  );
};