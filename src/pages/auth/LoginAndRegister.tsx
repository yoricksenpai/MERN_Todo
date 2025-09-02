import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { register, login } from "../../api/auth";
import { showSuccess, showError } from "../../utils/toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function LoginAndRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    try {
      if (isLogin) {
        const userInfo = await login(username, password);
        authLogin(userInfo);
        showSuccess('Connexion réussie!');
        navigate("/");
      } else {
        await register(username, email, password);
        showSuccess('Inscription réussie!');
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error:", error);
      showError(error.message || 'Une erreur est survenue');
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="min-h-screen flex">
        {/* Section gauche - Branding (cachée sur mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16 bg-gradient-to-br from-emerald-600 to-emerald-800">
          <div className="text-white">
            <h1 className="text-5xl xl:text-6xl font-bold mb-6">
              TodoApp
            </h1>
            <p className="text-xl xl:text-2xl mb-8 text-emerald-100">
              Organisez vos tâches avec style et efficacité
            </p>
            <div className="space-y-4 text-emerald-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
                <span>Gestion intuitive des tâches</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
                <span>Notifications intelligentes</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
                <span>Synchronisation temps réel</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section droite - Formulaire */}
        <div className="flex-1 flex items-center justify-center px-4 lg:px-12">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 lg:hidden">
                TodoApp
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {isLogin ? "Connexion" : "Inscription"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte"}
              </p>
            </div>
            
            <Card className="p-6 lg:p-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full text-lg py-4"
                >
                  {isLogin ? "Se connecter" : "S'inscrire"}
                </Button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
                  <button
                    className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                  </button>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAndRegister;