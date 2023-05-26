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
            head: "Lizard",
            body1:
              "Lizards are a widespread group of squamate reptiles, with over ",
            body2:
              "6,000 species, ranging across all continents except Antarctica",
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
          }
        },
      },
      de: {
        translation: {
          navbar: {
            home: "Heim",
            about: "Um",
            users: "Benutzer",
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
            head: "Eidechse",
            body1:
              "Eidechsen sind eine weit verbreitete Gruppe von Squamat-Reptilien, mit über ",
            body2: "6.000 Arten auf allen Kontinenten außer der Antarktis",
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
          }
        },          
      },
      pt: {
        translation: {
          navbar: {
            home: "Lar",
            about: "Sobre",
            users: "Usuários",
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
            head: "Lagarto",
            body1:
              "Os lagartos são um grupo difundido de répteis escamados, com mais de ",
            body2:
              "6.000 espécies, abrangendo todos os continentes, exceto a Antártida",
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
          }
        },
      },
    },
  });

export default i18n;
