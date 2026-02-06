import React, { useState } from 'react';
import Home from './screens/Home';
import MapScreen from './screens/Map';
import QuizScreen from './screens/QuizScreen';
import ShopScreen from './screens/ShopScreen';
import AdminScreen from './screens/AdminScreen';

function App() {
  const [screen, setScreen] = useState('home');
  const [currentLevelId, setCurrentLevelId] = useState(null);

  const navigateTo = (screenName) => setScreen(screenName);

  const handleLevelSelect = (levelId) => {
    setCurrentLevelId(levelId);
    setScreen('quiz');
  };

  return (
    <div className="App font-hand text-gray-900">
      {screen === 'home' && (
        <Home
          onNavigateToMap={() => navigateTo('map')}
          onNavigateToShop={() => navigateTo('shop')}
          onNavigateToAdmin={() => navigateTo('admin')}
        />
      )}

      {screen === 'shop' && (
        <ShopScreen
          onBack={() => navigateTo('home')}
        />
      )}

      {screen === 'map' && (
        <MapScreen
          onBack={() => navigateTo('home')}
          onSelectLevel={handleLevelSelect}
        />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          levelId={currentLevelId}
          onBack={() => navigateTo('map')}
          onComplete={() => navigateTo('map')}
        />
      )}

      {screen === 'admin' && (
        <AdminScreen
          onBack={() => navigateTo('home')}
        />
      )}
    </div>
  );
}

export default App;
