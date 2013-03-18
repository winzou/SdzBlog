<?php

namespace Sdz\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

class CommentaireType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('contenu', 'textarea');

        $builder->addEventListener(
          FormEvents::PRE_SET_DATA,
        	function (FormEvent $event) {
        	  if (null === $event->getData()->getUser()) {
        	    $event->getForm()->add('auteur', 'text');
        	  }
          }
        );
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Sdz\BlogBundle\Entity\Commentaire'
        ));
    }

    public function getName()
    {
        return 'sdz_blogbundle_commentairetype';
    }
}
