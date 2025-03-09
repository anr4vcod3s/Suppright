import HeroComponent from '@/components/HeroComponent'; 
import CartDisplay from '@/components/ShoppingCartComponent'; 

// Create a new instance of QueryClient

const HomePage = () => {
  return (
      
        <main  className="pt-20 flex flex-col items-center">
          <HeroComponent/>
          <CartDisplay />
        </main>
      
  );
};

export default HomePage;
