# Beadando
AGY276 Első Beadandó

Program neve : Szabadúszó
Készítette: Lévai András

    A program egy munkakereső alkalmazás, melyben mind munka válallók mind munkaadók részt vehetnek.
    A főoldalon két fajta accountot lehet regisztálni. A munka vállalóit, melyel csak böngészni és 
    elfogadni lehet munka ajánlokat. A munka adóival már felvehetünk új munkákat is(jelengleg ezek 
    száma 1-re van korlátozva felhasználóként),
    majd az általunk létrehozott munkák adatait szerkezhetjük vagy törölhetjük is őket az adatbázisból.
    
        A program felépítése:
            
            Modellek:
                -user modell: A user modell tárolja a felhasználók adatait. Minden felhasználó rendelkezik
                vezeték és keresztnévvel, azonosítóval, jelszóval, egy tulajdonsággal hogy munkaadók vagy
                munkavállalók e, egy boolean típusú 'isMunkaado' értékkel, ami eldönti róluk hogy miylen 
                típúsuak (ennek értéke alap állapotba false, de amikor munkavállalóval regisztrálunk akkor 
                ennek értéke true lesz). Emellet a munkavállalói regisztrációks űrlapon megadható egy cég
                név is és egy város név, de ezek opcionálisak csak.
                
                -munka modell: Itt tároljuk a munkának a tulajdonságait. Minden munka rendelkezik egy azonosítóval,
                amely egy 10-99 közötti száma, értékét pedig egy random szám generátor állítja be. Emellett a munkaadóknak
                meg kell adniuk a munka típusát, leírását,órabérét valamint a várost ahol a munkát ajánlják.
                
            
            Controllerek:
                -index : Egy egyszerű controller, ami a főoldalért felel, ki és be jelentkezési funciói vannak.
                
                -login : A login három úttal rendelkezik, egy a bejelentkezésért felel, a másik kettő pedig a 
                munkavállalói és a munkaadói űrlapokkal és az azon felvett adatokkal foglalkozik. A tényleges
                bejelentkezés vizsgálatát azonban a
                "server.js" fájl intézi.
                
                -munka : Ez a controller jeleníti meg a munkák listáját, melyek táblázatba vannak elhelyezve.
                A felhasználó erre az oldalra érkezik bejelentkezés után és innen mehet tovább a többi opcióra.
                
                -szer : Az alkalmazás legfontosabb része. Ez az út zárt a munkavállalók számára, hiszen ők le
                vannak korlátozva, nem vehetnek fel munkákat, így nem is szerkeszthetik vagy törölhetik azokat.
                A munkaadók végrehajthatják az imént említett funkciókat, azonban rájuk is vonatkoznak megkötések.
                Más munkaadó felhasználó által létrehozott munkákat nem módosíthatnak/törölhetnek.
            
            Public:
                -Az alkalmazás alatt a Bootstrap "sueprhero" sémája fut.
                
            Views:
                -index: Az index controller megjelenítése.
                
                -login: Három oldallal rendekezik.  Az "index" a főoldal, itt lehet bejelentkezni, valamint kiválasztani
                                                    milyen szerepkörbe szeretnénk regisztrálni magunkat. Hozzá tartozik egy "post" metódus.
                                                    
                                                    A "signup" a munkaadók regisztrációjának a sablonját tartalmazza. Hozzá tartozik egy
                                                    "get" és egy "post" metódus.
                                                    
                                                    A "signupemp" a munkavállalók regisztrációjának sablonját tartalmazza. Hozzá tartozik egy
                                                    "get" és egy "post" metódus.
                
                -munkak : Két oldallal rendelkezik. Az "elfogad" csak egy egyszerű, üres hbs, mindössze azt a cél szolgálja, hogy egy munkavállaló 
                                                    elfogadjon egy adott munkát, ezzel megváltoztatva a munka státuszát. Hozzá tartozik egy "post" metódus.
                                                    A "munkalista" szerepe a munkák, azoknak a tulajdonságai, valamint a gombok megjelenítése, melyekke
                                                    a felhasználó közlekedni tud az oldalon. Hozzá tartozik egy "get" és egy "post" metódus.
                                                    
                -munkak_ado : Három oldallal rendelkezik. A "delete" egy üres oldal, amely egy adott munka törléséért fele. Hozzá tartozik egy "get" metódus.
                                                          A "felvesz" az új munka felvételének a sablonját tartalmazza. Hozzá tartozik egy "get" és egy "post" metódus.
                                                          A "szerkeszt" a munkák szerkesztésének a sablonját tartalmazza. Hozzá tartozik egy "get" és egy "post" metódus.
            