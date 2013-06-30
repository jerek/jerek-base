<?php

namespace JerekBase\Twig;

use Twig_Extension;
use Twig_SimpleFunction;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorAwareTrait;

/**
 * Class Extension
 * @package JerekBase\Twig
 */
class Extension extends Twig_Extension implements ServiceLocatorAwareInterface
{
    use ServiceLocatorAwareTrait;

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'jerekbase';
    }

    /**
     * @return array
     */
    public function getFunctions()
    {
        return [
            'config' => new Twig_SimpleFunction('config', function() {
                $config = $this->getServiceLocator()->get('Configuration');

                return isset($config['application']['configuration']) ?
                    $config['application']['configuration'] : [];
            }),
        ];
    }
}