# TechChallenge
Hotel Automation Web Page

>Note: for internal use.
>https://hotel-app-zcode.herokuapp.com/
>
>Heroku account: `mihai.pricob@student.usv.ro`
>Heroku password: `zcodeteam22!`
## Note utile despre cum sa folosim git:
1. va descarcati git bash pe pc.
2. in folderul unde veti lucra executati urmatoarea comanda:
```
git clone ssh key
```

unde in loc de `ssh key` trebuie sa puneti cheia ssh pe care o preluati de pe github.

3. inainte de a incepe sa lucrati la branch-ul vostru, trebuie sa va asigurati ca el se afla la acelasi nivel cu branch-ul master.
```
git fetch -p
git checkout master
git pull

git checkout your_branch_name
git rebase master
```

4. Voi incerca sa deschid issues pentru toate task-urile pe care le-ati mentionat in `ImplementationPlan->Work Breakdown`.
5. Atunci cand implementati un task, adaugati label `Code` si creati un branch personal cu numele vostru + nr issue, spre exemplu: `apostovan_10`
```
git checkout -b apostovan_10
```

6. Pentru a vedea ce fisiere ati modificat pe branch-ul pe care sunteti:
```
git status
```
7. Pentru a adauga fisiere pe git:
```
git add nume_fisier

sau

git add -u // pentru a adauga toate fisierele
```

8. Pentru a adauga un commit:
```
git commit -m "mesajul comitului"
```

as vrea ca mesajul comitului sa fie ceva de genul: `[nr_issue][Add/Change/Fix] ce anume ati implementat in general`

spre exemplu: `"[10][Add] login backend implementation."`

9. Ca sa incarcati modificarile voatre pe git:
```
git push origin nume_branch -p
```

10. Daca ati terminat task-ul adaugati label `CodeReview` si anuntati in chat ca sa se uite cineva peste el (in special la front-end va puteti face code review unul altuia).

11. Dupa ce se va face code review voi integra branch-ul vostru in master.
