import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          navbar: {
            home: "Home",
            about: "About",
            users: "Users",
            campaign: "Campaign",
            dbeditor: "DB Editor",
            profile: "Profile",
            login: "Login",
            logout: "Logout",
            setlang: "Set Language",
          },
          login: {
            signin: "Sign in",
            login: "Login",
            password: "Password",
            submit: "SUBMIT",
            forgotpassword: "Forgot Password?",
            noserverresponse: "No Server Response",
            incorrectusernameorpassword: "Incorrect Username or Password",
            unauthorized: "Unauthorized",
            loginfailed: "Login Failed",
          },
          home: {
            head: "Savage Worlds",
            body1:
              "Savage Worlds is the core ruleset for all of Pinnacle’s roleplaying games. ",
            body2:
              "This game references the Savage Worlds game system, available from Pinnacle Entertainment Group at www.peginc.com. Savage Worlds and all associated logos and trademarks are copyrights of Pinnacle Entertainment Group. Used with permission. Pinnacle makes no representation or warranty as to the quality, viability, or suitability for purpose of this product.",
            action: "Learn More",
          },
          locales: {
            locale: "Locale",
            test: "This is a test",
          },
          dbeditor: {
            table: "Table",
            selecttable: "Select Table",
            exportdb: "Export DB",
            none: "None",
          },
          profile: {
            profile: "Profile",
            login: "Login",
            nickname: "Nickname",
            email: "Email",
            roles: "Roles",
            locale: "Locale",
            none: "none",
          },
          user: {
            title: "Edit User",
            user: "User",
            login: "Login",
            nickname: "Nickname",
            email: "Email",
            roles: "Roles",
            locale: "Locale",
            misc: "Misc",
            active: "Active",
            resetpwd: "Reset Password",
            addauser: "Add a user",
            update: "Update",
            erroruserdata: "Error getting user data",
            updatesuccess: "Update Success",
            updatefailure: "Update Failure",
            inputerror: "Input Error - Invalid Input",        
          },
          footer: {
            user: "User",
            notloggedIn: "Not Logged In",
          }
        },
      },
      de: {
        translation: {
          navbar: {
            home: "Heim",
            about: "Um",
            users: "Benutzer",
            campaign: "Kampagne",
            dbeditor: "DB-Editor",
            profile: "Profil",
            login: "Anmeldung",
            logout: "Ausloggen",
            setlang: "Sprache Einstellen",
          },
          login: {
            signin: "Anmelden",
            login: "Anmeldung",
            password: "Passwort",
            submit: "EINREICHEN",
            forgotpassword: "Passwort Vergessen?",
            noserverresponse: "Keine Serverantwort",
            incorrectusernameorpassword: "Falscher Benutzername oder Passwort",
            unauthorized: "Unbefugt",
            loginfailed: "Fehler bei der Anmeldung",
          },
          home: {
            head: "Wilde Welten",
            body1: 
              "Savage Worlds ist der Kernregelsatz für alle Rollenspiele von Pinnacle. ",
            body2: 
              "Dieses Spiel bezieht sich auf das Spielsystem Savage Worlds, erhältlich bei der Pinnacle Entertainment Group unter www.peginc.com. Savage Worlds und alle damit verbundenen Logos und Marken unterliegen dem Urheberrecht der Pinnacle Entertainment Group. Mit Genehmigung verwendet. Pinnacle gibt keine Zusicherungen oder Garantien hinsichtlich der Qualität, Brauchbarkeit oder Eignung für den Zweck dieses Produkts.",
            action: "Weitere Informationen",
          },
          locales: {
            locale: "Gebietsschema",
            test: "Das ist ein Test",
          },
          dbeditor: {
            table: "Tisch",
            selecttable: "Wählen Sie Tabelle aus",
            exportdb: "DB exportieren",
            none: "Keiner",
          },
          profile: {
            profile: "Profil",
            login: "Anmeldung",
            nickname: "Spitzname",
            email: "Email",
            roles: "Rollen",
            locale: "Gebietsschema",
            none: "keiner",
          },
          user: {
            title: "Benutzer Bearbeiten",
            user: "Benutzer",
            login: "Anmeldung",
            nickname: "Spitzname",
            email: "Email",
            roles: "Rollen",
            locale: "Gebietsschema",
            misc: "Sonstiges",
            active: "Aktiv",
            resetpwd: "Passwort Zurücksetzen",
            addauser: "Fügen Sie einen Benutzer hinzu",
            update: "Aktualisieren",
            erroruserdata: "Fehler beim Abrufen der Benutzerdaten",
            updatesuccess: "Erfolg Aktualisieren",
            updatefailure: "Aktualisierungsfehler",
            inputerror: "Eingabefehler - Ungültige Eingabe",
          },
          footer: {
            user: "Benutzer",
            notloggedIn: "Nicht eingeloggt",
          }
        },          
      },
      pt: {
        translation: {
          navbar: {
            home: "Lar",
            about: "Sobre",
            users: "Usuários",
            campaign: "Campanha",
            dbeditor: "Editor de banco de dados",
            profile: "Perfil",
            login: "Conecte-se",
            logout: "Sair",
            setlang: "Definir Idioma",
          },
          login: {
            signin: "Entrar",
            login: "Conecte-se",
            password: "Senha",
            submit: "ENVIAR",
            forgotpassword: "Esqueceu sua senha?",
            noserverresponse: "Nenhuma resposta do servidor",
            incorrectusernameorpassword: "Usuário ou senha incorretos",
            unauthorized: "Não autorizado",
            loginfailed: "Falha no login",
          },
          home: {
            head: "Mundos Selvagens",
            body1:
              "Savage Worlds é o conjunto de regras básico para todos os jogos de RPG da Pinnacle. ",
            body2:
              "Este jogo faz referência ao sistema de jogo Savage Worlds, disponível no Pinnacle Entertainment Group em www.peginc.com. Savage Worlds e todos os logotipos e marcas comerciais associados são direitos autorais da Pinnacle Entertainment Group. Usado com permissão. A Pinnacle não faz nenhuma representação ou garantia quanto à qualidade, viabilidade ou adequação para a finalidade deste produto.",
            action: "Saber mais",
          },
          locales: {
            locale: "Localidade",
            test: "Isto é um teste",
          },
          dbeditor: {
            table: "Mesa",
            selecttable: "Selecione a tabela",
            exportdb: "Exportar banco de dados",
            none: "Nenhum",
          },
          profile: {
            profile: "Perfil",
            login: "Conecte-se",
            nickname: "Apelido",
            email: "E-mail",
            roles: "Funções",
            locale: "Localidade",
            none: "Nenhum",
          },
          user: {
            title: "Editar usuário",
            user: "Do utilizador",
            login: "Conecte-se",
            nickname: "Apelido",
            email: "E-mail",
            roles: "Funções",
            locale: "Localidade",
            misc: "Diversos",
            active: "Ativo",
            resetpwd: "Redefinir senha",
            addauser: "Adicionar um usuário",
            update: "Atualizar",
            erroruserdata: "Erro ao obter dados do usuário",
            updatesuccess: "Atualização feita com sucesso",
            updatefailure: "Falha na atualização",
            inputerror: "Erro de entrada - entrada inválida",        
          },
          footer: {
            user: "Do utilizador",
            notloggedIn: "Não logado",
          }
        },
      },
    },
  });

export default i18n;
