<?php

namespace JerekBase\Service;

use Assetic\Filter\LessFilter;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * Class LessFactory
 * @package JerekBase\Service
 */
class LessFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $config = $serviceLocator->get('Configuration');
        $config = $config['jerekbase'];

        $filter = new LessFilter();

        foreach((array) $config['less']['paths'] as $path) {
            $filter->addLoadPath($path);
        }

        return $filter;
    }
}
