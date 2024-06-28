### App description
New version of the OSoMe Stats page:  https://osome.iu.edu/stats/.  

### Tech stack
1. [Django](https://www.djangoproject.com/), [Django REST](https://www.django-rest-framework.org/)
2. [Vue 3](https://vuejs.org/) (Preferably with the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html))
3. [Typescript](https://www.typescriptlang.org/)
4. Python, ideally with [type hinting](https://docs.python.org/3/library/typing.html)
5. [Rivet Design Framework](https://rivet.iu.edu/)

### Requirements
1. Login system using Django's built in authentication. (user management, login, logout)
2. Use whatever DB you want, but interact with it via Django's ORM, if necessary
3. IU Brand compliant via Rivet.  Take advantage of all the components.
4. Display the various statistics about OSoMe that we currently have on [the stats page](https://osome.iu.edu/stats/). 
   - Just the numbers!  **Don't waste time with graphs!**  That's outside the scope of this and misses the point.
   - Stats are all in static files somewhere on lisa (e.g. /home/data/osome_swap/moe/tweetcount
 for the Moe tweets).  Store them however you want (put in a database, read static files, whatever)
   - Make it [interesting to look at](https://rivet.iu.edu/components/stat/) and add some [interactive navigation](https://rivet.iu.edu/components/tabs/) or a search.
5. Don't hack things together!  Do it the right way!  Follow tutorials, read documentation, etc.
6. Don't reinvent the wheel! If you do anything fancy, use only pre-existing plugins and libraries (this goes for both front and backend).  Why waste your time on stuff someone else has already built?  But always remember Rule 5: Do it the right way!
7. K.I.S.S. - Keep It Simple, Stupid.  Sometimes it's unavoidable, but complexity begets problems.  The more complex your code, the more likely it is to introduce bugs, and the more difficult it is to debug.
8. Bonus Points:  Use Test-Driven Development.  Write your tests before and during your actual coding, not afterwards.

### Why?

These are all solid technologies that enhance the development experience for larger applications.  Vanilla Javascript and stripped down Flask APIs are great for small one-off apps like Coordiscope and Botometer but larger and more complex apps like Enso or Fakey could benefit from stronger infrastructures and a better developer experience, especially when there's a team of devs on a single project.  I think we don't use them mainly because I (Ben) never used them and our newer projects start from templates based on older projects.  Even if we did want to use some updated technology, there's always a learning curve, so it's rarely practical to change up our whole process, given our limited resources.  Why not take some time to build out a toy project with low stakes and learn some new stuff.

Yes, it's probable that this project doesn't *need* an SPA.  We don't *need* to use Vue.  It doesn't *need* authentication.  It doesn't *need* a database.  It's a very simple application.  I wrote the original version with uncompiled Vue, a static html page, and Apache basic authentication.  But that's not the point.  The goal is to learn some new stuff that will be useful in the future for when we *do* need to make a more extensive application.
