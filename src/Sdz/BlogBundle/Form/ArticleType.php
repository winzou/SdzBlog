<?php
// src/Sdz/BlogBundle/Form/ArticleType.php

namespace Sdz\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

class ArticleType extends AbstractType
{
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
    $builder
      ->add('date',        'datetime')
      ->add('titre',       'text')
      ->add('contenu',     'textarea')
      ->add('image',       new ImageType(), array('required' => false))
      ->add('categories',  'entity',        array(
        'class'    => 'SdzBlogBundle:Categorie',
        'property' => 'nom',
        'multiple' => true
      ))
      /*
       * Rappel pour un champ de type collection :
       ** - 1er argument : nom du champ, ici "categories" car c'est le nom de l'attribut ;
       ** - 2e argument : type du champ, ici "collection" qui est une liste de quelque chose ;
       ** - 3e argument : tableau d'options du champ.
      */

      ->add('articleCompetences', 'collection', array(
          'type'         => new ArticleCompetenceType(),
          'allow_add'    => true,
          'allow_delete' => true,
      	//'mapped'       => false,
          'by_reference' => false,
          'required'     => false
      ))
    ;

    // On ajoute une fonction qui va écouter l'évènement PRE_SET_DATA
    $builder->addEventListener(
      FormEvents::PRE_SET_DATA,    // Ici, on définit l'évènement qui nous intéresse
      function(FormEvent $event) { // Ici, on définit une fonction qui sera exécutée lors de l'évènement
        $article = $event->getData();
        // Cette condition est importante, on en reparle plus loin
        if (null === $article) {
          return; // On sort de la fonction lorsque $article vaut null
        }
        // 1. Si l'article n'est pas encore publié, on ajoute le champ publication
        if (false === $article->getPublication()) {
          $event->getForm()->add('publication', 'checkbox', null, array('required' => false));
        } else { // Sinon, on le supprime
          $event->getForm()->remove('publication');
        }

        // 2. Si un User est attaché à l'article, on n'affiche pas le champ auteur
        if (null === $article->getUser()) {
        	$event->getForm()->add('auteur', 'text');
        } else {
        	$event->getForm()->add('user', 'entity', array('class' => 'SdzUserBundle:User'));
        }
      }
    );
  }

  public function setDefaultOptions(OptionsResolverInterface $resolver)
  {
    $resolver->setDefaults(array(
      'data_class' => 'Sdz\BlogBundle\Entity\Article'
    ));
  }

  public function getName()
  {
    return 'sdz_blogbundle_articletype';
  }
}
